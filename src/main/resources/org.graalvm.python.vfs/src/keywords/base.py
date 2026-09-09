from functools import wraps
from collections.abc import Iterable, Iterator
from typing import Callable, ParamSpec, Protocol, TypeVar, cast

import base64
import inspect
import json
import sys


class InteropObject(Protocol):
    def __getattr__(self, name: str) -> "InteropObject": ...
    def __call__(self, *args: object, **kwargs: object) -> "InteropObject": ...
    def __iter__(self) -> Iterator["InteropObject"]: ...
    def __int__(self) -> int: ...
    def __str__(self) -> str: ...
    def __bool__(self) -> bool: ...


class JavaModule(Protocol):
    @staticmethod
    def type(klass: str) -> InteropObject: ...


try:
    import java as _java  # pyright: ignore
except ImportError:
    # Fix typechecks outside graalpy
    class _JavaFallback:
        @staticmethod
        def type(klass: str) -> InteropObject:
            raise RuntimeError(
                "GraalPy java interop is unavailable in this environment"
            )

    java: JavaModule = _JavaFallback()
else:
    java = _java


__all__ = [
    "InteropObject",
    "BoundaryValue",
    "Variables",
    "VariableValue",
    "DmnValue",
    "ScalarValue",
    "NativeValue",
    "except_interop_exception",
    "wrap_boundary_value",
    "unwrap_boundary_value",
    "with_authenticated_user",
    "java",
]


class _RobotLogger(Protocol):
    def debug(self, message: str) -> None: ...


class BoundaryValue(str):
    """Serializable representation for Java values crossing a Robot boundary.

    Robot Framework variables do not reliably preserve arbitrary GraalPy foreign
    Java objects between keyword calls.  For example, a Java ``FileValue`` can
    arrive at the next keyword as the result of ``FileValueImpl.toString()``
    rather than as a typed ``FileValue``.  The receiving keyword then takes the
    untyped ``putValue`` path and Operaton cannot treat the text as a file.

    This class is intentionally a ``str`` subclass.  Robot scalar variables can
    preserve strings, and the same representation can cross the XML-RPC Remote
    protocol used by RobotCode and the CPython proxy.  Arbitrary Java objects
    cannot be assumed to be XML-RPC serializable, so supported values are
    encoded as a tagged string containing only JSON-compatible metadata and,
    for files, Base64-encoded bytes.

    ``wrap_boundary_value`` creates this representation when a keyword returns
    a supported Java value.  ``unwrap_boundary_value`` recognizes the tag at
    the next keyword boundary and reconstructs a new Java value before the
    keyword calls Operaton.  The explicit tag prevents ordinary user strings
    from being interpreted as boundary values accidentally.
    """

    _PREFIX = "__operaton_boundary__:"

    def __new__(cls, kind: str, value: InteropObject) -> "BoundaryValue":
        payload: dict[str, object]
        if kind == "date":
            payload = {"millis": int(value.getTime())}
        elif kind == "file":
            raw_content = value.getValue().readAllBytes()
            content = bytes(
                int(item) & 0xFF for item in cast(Iterable[InteropObject], raw_content)
            )
            payload = {
                "filename": str(value.getFilename()),
                "mime_type": str(value.getMimeType()),
                "content": base64.b64encode(content).decode("ascii"),
            }
        else:
            payload = {"type": type(value).__name__}
        return str.__new__(
            cls,
            cls._PREFIX + kind + ":" + json.dumps(payload, separators=(",", ":")),
        )


def _is_java(class_name: str, value: object) -> bool:
    java_class = java.type(class_name)
    try:
        return isinstance(value, cast(type[object], java_class))
    except TypeError:
        return bool(java_class.isInstance(value))


def wrap_boundary_value(value: object) -> object:
    if isinstance(value, BoundaryValue):
        return value
    if isinstance(value, list):
        return [wrap_boundary_value(item) for item in value]
    if isinstance(value, tuple):
        return tuple(wrap_boundary_value(item) for item in value)
    if isinstance(value, dict):
        return {key: wrap_boundary_value(item) for key, item in value.items()}
    if value is None or isinstance(value, (str, int, float, bool, bytes)):
        return value
    if _is_java("java.util.Date", value):
        return BoundaryValue("date", cast(InteropObject, value))
    if _is_java("org.operaton.bpm.engine.variable.value.FileValue", value):
        return BoundaryValue("file", cast(InteropObject, value))
    if _is_java("java.lang.Object", value):
        return BoundaryValue("unsupported", cast(InteropObject, value))
    return value


def unwrap_boundary_value(value: object) -> object:
    if isinstance(value, str) and value.startswith(BoundaryValue._PREFIX):
        _, kind, encoded = value.split(":", 2)
        payload = json.loads(encoded)
        if kind == "date":
            return java.type("java.util.Date")(int(payload["millis"]))
        if kind == "file":
            content = base64.b64decode(str(payload["content"]))
            return (
                Variables.fileValue(str(payload["filename"]))
                .file(content)
                .mimeType(str(payload["mime_type"]))
                .create()
            )
        raise TypeError(f"Unsupported Java value crossing Robot boundary: {payload}")
    if isinstance(value, list):
        return [unwrap_boundary_value(item) for item in value]
    if isinstance(value, tuple):
        return tuple(unwrap_boundary_value(item) for item in value)
    if isinstance(value, dict):
        return {key: unwrap_boundary_value(item) for key, item in value.items()}
    return value


try:
    from robot.api import logger as _rf_logger_raw  # pyright: ignore

    _rf_logger: _RobotLogger | None = _rf_logger_raw
except Exception:
    _rf_logger = None


Variables = java.type("org.operaton.bpm.engine.variable.Variables")

# Domain type aliases
VariableValue = str | int | float | bool | InteropObject | None
"""Any value that can be stored as a process/task variable."""

DmnValue = str | int | float | bool | None
"""A single DMN FEEL output cell (String/Integer/Long/Double/Boolean or null)."""

ScalarValue = str | int | float | bool | None
"""A Python-native scalar value after conversion from Java."""

NativeValue = str | int | float | bool | list[object] | dict[str, object] | None
"""A fully-converted Python-native value including collections."""

P = ParamSpec("P")
R = TypeVar("R")


def _interop_message(exc: BaseException) -> str:
    message = str(exc) if str(exc) else "Unknown error"
    get_message = getattr(exc, "getMessage", None)
    if callable(get_message):
        java_msg_obj = get_message()
        java_msg = str(java_msg_obj) if java_msg_obj is not None else ""
        if java_msg:
            message = java_msg
    return message


def _interop_stack(exc: BaseException) -> list[str]:
    get_stack = getattr(exc, "getStackTrace", None)
    if not callable(get_stack):
        return []
    trace_obj = get_stack()
    if trace_obj is None:
        return []

    frames: list[str] = []
    try:
        for elem in trace_obj:
            frames.append(str(elem))
            if len(frames) >= 5:
                break
    except TypeError:
        return []
    return frames


def except_interop_exception(func: Callable[P, R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        try:
            unwrapped_args = tuple(unwrap_boundary_value(value) for value in args)
            unwrapped_kwargs = {
                key: unwrap_boundary_value(value) for key, value in kwargs.items()
            }
            callable_func = cast(Callable[..., R], func)
            return cast(
                R,
                wrap_boundary_value(callable_func(*unwrapped_args, **unwrapped_kwargs)),
            )
        except BaseException as exc:
            message = _interop_message(exc)
            try:
                frames = _interop_stack(exc)
                if frames:
                    stack_text = "Java stack trace:\n  " + "\n  ".join(frames)
                    if _rf_logger is not None:
                        _rf_logger.debug(stack_text)
                    else:
                        print(stack_text)
            except Exception:
                pass
            # GraalPy interop can surface foreign throwables that are not
            # valid Python exception causes for ``raise ... from``.
            raise AssertionError(message)

    return wrapper


def with_authenticated_user(func: Callable[P, R]) -> Callable[P, R]:
    """Decorator that sets the authenticated user around a keyword call.

    Looks for a ``user_id`` parameter in the decorated function's signature.
    If the caller supplies a non-empty value it is set on the engine's
    IdentityService before the call and cleared in a ``finally`` block
    """
    sig = inspect.signature(func)
    param_names = list(sig.parameters.keys())

    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        user_id = ""
        if "user_id" in kwargs:
            maybe_user = kwargs["user_id"]
            if isinstance(maybe_user, str):
                user_id = maybe_user
        # try positional arguments if keyword not used
        if not user_id and "user_id" in param_names:
            idx = param_names.index("user_id")
            if idx < len(args):
                maybe_user = args[idx]
                if isinstance(maybe_user, str):
                    user_id = maybe_user

        self_obj = args[0] if args else None
        engine = getattr(self_obj, "engine", None) if self_obj else None
        # if not found, try to find via self.ctx.engine (specialized keyword classes)
        if engine is None and self_obj is not None:
            ctx = getattr(self_obj, "ctx", None)
            engine = getattr(ctx, "engine", None) if ctx else None

        if user_id and engine:
            engine.getIdentityService().setAuthenticatedUserId(user_id)
        try:
            return func(*args, **kwargs)
        finally:
            if user_id and engine:
                engine.getIdentityService().setAuthenticatedUserId(None)

    return wrapper

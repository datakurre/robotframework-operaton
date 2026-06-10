from functools import wraps
from collections.abc import Iterator
from typing import Callable, ParamSpec, Protocol, TypeVar

import inspect
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
    "Variables",
    "VariableValue",
    "DmnValue",
    "ScalarValue",
    "NativeValue",
    "except_interop_exception",
    "with_authenticated_user",
    "java",
]


class _RobotLogger(Protocol):
    def debug(self, message: str) -> None: ...


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
            return func(*args, **kwargs)
        except Exception as exc:
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
            raise AssertionError(message) from exc

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

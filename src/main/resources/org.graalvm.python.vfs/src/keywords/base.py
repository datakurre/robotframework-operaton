from functools import wraps
from typing import Any

import inspect
import sys

try:
    import java  # pyright: ignore
except ImportError:
    # Fix typechecks outside graalpy
    class java:
        @staticmethod
        def type(klass: str) -> Any:
            pass


try:
    from robot.api import logger as _rf_logger  # pyright: ignore
except Exception:
    _rf_logger = None


Variables = java.type("org.operaton.bpm.engine.variable.Variables")


def except_interop_exception(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except:  # noqa
            exc_type, exc_value, exc_traceback = sys.exc_info()
            message = str(exc_value) if exc_value else "Unknown error"
            try:
                if hasattr(exc_value, "getMessage"):
                    java_msg = exc_value.getMessage()
                    if java_msg:
                        message = str(java_msg)
                if hasattr(exc_value, "getStackTrace"):
                    trace = exc_value.getStackTrace()
                    if trace:
                        frames = []
                        for elem in trace:
                            frames.append(str(elem))
                            if len(frames) >= 5:
                                break
                        if frames:
                            stack_text = "Java stack trace:\n  " + "\n  ".join(frames)
                            if _rf_logger is not None:
                                _rf_logger.debug(stack_text)
                            else:
                                print(stack_text)
            except Exception:
                pass
            assert False, message

    return wrapper


def with_authenticated_user(func):
    """Decorator that sets the authenticated user around a keyword call.

    Looks for a ``user_id`` parameter in the decorated function's signature.
    If the caller supplies a non-empty value it is set on the engine's
    IdentityService before the call and cleared in a ``finally`` block
    """
    sig = inspect.signature(func)
    param_names = list(sig.parameters.keys())

    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = kwargs.get("user_id", "")
        # try positional arguments if keyword not used
        if not user_id and "user_id" in param_names:
            idx = param_names.index("user_id")
            if idx < len(args):
                user_id = args[idx]

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

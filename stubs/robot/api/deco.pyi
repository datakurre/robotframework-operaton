from collections.abc import Callable
from typing import TypeVar, overload

_F = TypeVar("_F", bound=Callable[..., object])

@overload
def keyword(func: _F) -> _F: ...
@overload
def keyword(name: str) -> Callable[[_F], _F]: ...

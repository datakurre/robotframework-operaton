from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class IdentityKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def ensure_user(
        self,
        user_id: str,
        first_name: str = "Test",
        last_name: str = "User",
        email: str = "test.user@example.invalid",
    ) -> None:
        """Creates or updates a process-engine identity user for BPMN identity lookups."""
        assert self.ctx.engine, "No engine"
        identity = self.ctx.engine.getIdentityService()
        user = identity.createUserQuery().userId(user_id).singleResult()
        if user is None:
            user = identity.newUser(user_id)
        user.setFirstName(first_name)
        user.setLastName(last_name)
        user.setEmail(email)
        identity.saveUser(user)

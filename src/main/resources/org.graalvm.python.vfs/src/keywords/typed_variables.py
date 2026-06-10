from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import InteropObject, java, except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class TypedVariables:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def create_integer_variable(self, value: str | int) -> int:
        """Creates a Java Integer value for typed DMN/process variable input.

        Example usage in Robot::

            ${total}=    Create Integer Variable    1500
            ${result}=    Evaluate Decision    order-priority    orderTotal=${total}
        """
        Integer = java.type("java.lang.Integer")
        return Integer.valueOf(int(str(value)))  # type: ignore[return-value]  # GraalPy auto-boxes

    @keyword
    @except_interop_exception
    def create_double_variable(self, value: str | float) -> float:
        """Creates a Java Double value for typed DMN/process variable input.

        Example usage in Robot::

            ${price}=    Create Double Variable    99.99
        """
        Double = java.type("java.lang.Double")
        return Double.valueOf(float(str(value)))  # type: ignore[return-value]  # GraalPy auto-boxes

    @keyword
    @except_interop_exception
    def create_boolean_variable(self, value: str | bool) -> bool:
        """Creates a Java Boolean value for typed DMN/process variable input.

        Example usage in Robot::

            ${flag}=    Create Boolean Variable    true
        """
        Boolean = java.type("java.lang.Boolean")
        if isinstance(value, str):
            return Boolean.valueOf(value.lower() in ("true", "yes", "1"))  # type: ignore[return-value]  # GraalPy auto-boxes
        return Boolean.valueOf(bool(value))  # type: ignore[return-value]  # GraalPy auto-boxes

    @keyword
    @except_interop_exception
    def create_date_variable(
        self, value: str, pattern: str = "yyyy-MM-dd"
    ) -> InteropObject:
        """Creates a Java Date value for typed DMN/process variable input.

        Example usage in Robot::

            ${date}=    Create Date Variable    2025-01-15
        """
        SimpleDateFormat = java.type("java.text.SimpleDateFormat")
        sdf = SimpleDateFormat(pattern)
        return sdf.parse(str(value))

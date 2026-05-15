from robot.api.deco import keyword
from typing import Any

from keywords.base import Variables, except_interop_exception

try:
    import java  # pyright: ignore
except ImportError:
    class java:
        @staticmethod
        def type(klass: str) -> Any:
            pass


class FormKeywords:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def submit_task_form(
        self,
        process_instance_id: str,
        task_definition_key: str = "",
        **form_variables: Any,
    ):
        """Submits a user task form with the given field values.

        Variables are passed as named keyword arguments:

        Example usage in Robot::

            Submit Task Form    ${instance}    my-task
            ...    firstName=Alice    amount=42    approved=${True}
        """
        assert self.ctx.engine, "No engine"
        task_service = self.ctx.engine.getTaskService()
        form_service = self.ctx.engine.getFormService()
        query = task_service.createTaskQuery().processInstanceId(process_instance_id)
        if task_definition_key:
            query = query.taskDefinitionKey(task_definition_key)
        task = query.singleResult()
        assert task, f"No task found for instance {process_instance_id}"
        var_map = Variables.createVariables()
        for name, value in form_variables.items():
            var_map.putValue(name, value)
        form_service.submitTaskForm(task.getId(), var_map)

    @keyword
    @except_interop_exception
    def get_task_form_variables(
        self,
        process_instance_id: str,
        task_definition_key: str = "",
    ) -> dict:
        """Returns all form field variables for the active user task as a Python dict.

        Keys are the form field IDs; values are their current typed values converted
        to Python-native types (str, int, float, bool, or None).

        Example usage in Robot::

            ${vars}=    Get Task Form Variables    ${instance}    my-task
            Should Be Equal    ${vars}[status]    pending
        """
        assert self.ctx.engine, "No engine"
        task_service = self.ctx.engine.getTaskService()
        form_service = self.ctx.engine.getFormService()
        query = task_service.createTaskQuery().processInstanceId(process_instance_id)
        if task_definition_key:
            query = query.taskDefinitionKey(task_definition_key)
        task = query.singleResult()
        assert task, f"No task found for instance {process_instance_id}"
        java_map = form_service.getTaskFormVariables(task.getId())
        result = {}
        for entry in java_map.entrySet():
            key = str(entry.getKey())
            value = entry.getValue()  # VariableMap values are already raw Java objects
            # Convert Java primitives to Python natives
            if value is None:
                result[key] = None
            else:
                v = str(value)
                # Attempt numeric / boolean coercion
                if v.lower() == "true":
                    result[key] = True
                elif v.lower() == "false":
                    result[key] = False
                else:
                    try:
                        as_int = int(v)
                        result[key] = as_int
                    except ValueError:
                        try:
                            as_float = float(v)
                            result[key] = as_float
                        except ValueError:
                            result[key] = v
        return result

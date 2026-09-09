from robot.api.deco import keyword
from typing import TYPE_CHECKING, cast

from keywords.base import (
    Variables,
    VariableValue,
    except_interop_exception,
    java,
    unwrap_boundary_value,
)


if TYPE_CHECKING:
    from Operaton import Operaton


class ExternalTaskKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    def _is_java_typed_value(self, value: object) -> bool:
        JavaTypedValue = java.type("org.operaton.bpm.engine.variable.value.TypedValue")
        try:
            return isinstance(value, cast(type[object], JavaTypedValue))
        except TypeError:
            return bool(JavaTypedValue.isInstance(value))

    def _fetch_matching_task(
        self, topic: str, instance_id: str, worker_id: str
    ) -> object:
        assert self.ctx.engine, "No engine"
        external_task_service = self.ctx.engine.getExternalTaskService()
        tasks = (
            external_task_service.fetchAndLock(10, worker_id)
            .topic(topic, 1000)
            .execute()
        )

        for i in range(int(tasks.size())):
            task = tasks.get(i)
            if str(task.getProcessInstanceId()) == str(instance_id):
                return cast(object, task)

        raise AssertionError(
            f"No external task found for topic '{topic}' in process instance {instance_id}"
        )

    def _build_variable_map(
        self,
        variables: dict[str, VariableValue],
        date_variables: object,
        date_pattern: str,
    ) -> object:
        date_names = self.ctx._date_variable_names(date_variables)
        sdf = java.type("java.text.SimpleDateFormat")(date_pattern)
        missing_dates = date_names.difference(variables.keys())
        assert not missing_dates, (
            "Date variables were requested but not provided: "
            f"{sorted(missing_dates)}"
        )

        var_map = Variables.createVariables()
        for var_name, value in variables.items():
            value = unwrap_boundary_value(value)
            if var_name in date_names and not self.ctx._is_java_date(value):
                value = sdf.parse(str(value))
            value = cast(VariableValue, self.ctx._to_process_variable_value(value))
            if self._is_java_typed_value(value):
                var_map.putValueTyped(var_name, value)
            else:
                var_map.putValue(var_name, value)
        return var_map

    def _create_file_value(
        self,
        default_filename: str,
        default_mime_type: str,
    ) -> VariableValue:
        return cast(
            VariableValue,
            Variables.fileValue(default_filename)
            .file(b"")
            .mimeType(default_mime_type)
            .create(),
        )

    @keyword
    @except_interop_exception
    def fetch_and_lock(
        self,
        topic: str,
        worker_id: str = "robot-worker",
        max_tasks: str | int = 1,
        lock_duration: str | int = 10000,
    ) -> list[str]:
        """Fetches and locks external tasks for the given topic.

        Returns a list of external task IDs.

        Example usage in Robot::

            ${tasks}=    Fetch And Lock    myTopic
        """
        assert self.ctx.engine, "No engine"
        external_task_service = self.ctx.engine.getExternalTaskService()
        tasks = (
            external_task_service.fetchAndLock(int(str(max_tasks)), worker_id)
            .topic(topic, int(str(lock_duration)))
            .execute()
        )
        result = []
        for i in range(int(tasks.size())):
            result.append(str(tasks.get(i).getId()))
        return result

    @keyword
    @except_interop_exception
    def complete_external_task(
        self,
        external_task_id: str,
        worker_id: str = "robot-worker",
        **variables: VariableValue,
    ) -> None:
        """Completes an external task by its ID.

        Example usage in Robot::

            ${tasks}=    Fetch And Lock    myTopic
            ${task_id}=    Get From List    ${tasks}    0
            Complete External Task    ${task_id}
        """
        assert self.ctx.engine, "No engine"
        external_task_service = self.ctx.engine.getExternalTaskService()
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                value = unwrap_boundary_value(value)
                converted_value = cast(
                    VariableValue, self.ctx._to_process_variable_value(value)
                )
                if self._is_java_typed_value(converted_value):
                    var_map.putValueTyped(name, converted_value)
                else:
                    var_map.putValue(name, converted_value)
            external_task_service.complete(external_task_id, worker_id, var_map)
        else:
            external_task_service.complete(external_task_id, worker_id)

    @keyword
    @except_interop_exception
    def complete_external_task_for_topic(
        self,
        topic: str,
        process_instance_id: str = "",
        worker_id: str = "robot-worker",
        date_variables: object = "",
        date_pattern: str = "yyyy-MM-dd",
        **variables: VariableValue,
    ) -> None:
        """Fetches, locks, and completes one external task for the given topic in the selected process instance."""
        assert self.ctx.engine, "No engine"

        instance_id = process_instance_id or self.ctx._current_instance_id
        assert (
            instance_id
        ), "No process instance id provided and no current instance in scope"

        matching_task = self._fetch_matching_task(topic, instance_id, worker_id)
        external_task_service = self.ctx.engine.getExternalTaskService()

        if variables:
            var_map = self._build_variable_map(
                dict(variables), date_variables, date_pattern
            )
            external_task_service.complete(
                getattr(matching_task, "getId")(), worker_id, var_map
            )
        else:
            external_task_service.complete(getattr(matching_task, "getId")(), worker_id)

    @keyword
    @except_interop_exception
    def create_operaton_file_variable(
        self,
        default_filename: str,
        default_mime_type: str,
    ) -> VariableValue:
        """Creates a typed file value for external-task output.

        The returned value can be passed to ``Complete External Task For Topic``
        as a named output variable.
        """
        return self._create_file_value(
            default_filename=default_filename,
            default_mime_type=default_mime_type,
        )

    @keyword
    @except_interop_exception
    def throw_bpmn_error(
        self,
        external_task_id: str,
        error_code: str,
        error_message: str = "",
        worker_id: str = "robot-worker",
    ) -> None:
        """Throws a BPMN error for an external task, triggering error boundary events.

        Example usage in Robot::

            ${tasks}=    Fetch And Lock    myTopic
            ${task_id}=    Get From List    ${tasks}    0
            Throw Bpmn Error    ${task_id}    ERROR_CODE
        """
        assert self.ctx.engine, "No engine"
        external_task_service = self.ctx.engine.getExternalTaskService()
        external_task_service.handleBpmnError(
            external_task_id, worker_id, error_code, error_message
        )

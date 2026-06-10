from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import Variables, VariableValue, except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class ExternalTaskKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

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
                var_map.putValue(name, value)
            external_task_service.complete(external_task_id, worker_id, var_map)
        else:
            external_task_service.complete(external_task_id, worker_id)

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

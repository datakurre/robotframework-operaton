from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import java, except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class HistoryKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def get_completed_instances(
        self, process_definition_key: str = ""
    ) -> list[dict[str, str | None]]:
        """Returns a list of completed historic process instances as dicts.

        Each dict has: id, processDefinitionKey, startTime, endTime.
        """
        assert self.ctx.engine, "No engine"
        history = self.ctx.engine.getHistoryService()
        query = history.createHistoricProcessInstanceQuery().finished()
        if process_definition_key:
            query = query.processDefinitionKey(process_definition_key)
        instances = query.list()
        result = []
        for i in range(int(instances.size())):
            inst = instances.get(i)
            result.append(
                {
                    "id": str(inst.getId()),
                    "processDefinitionKey": str(inst.getProcessDefinitionKey()),
                    "startTime": (
                        str(inst.getStartTime()) if inst.getStartTime() else None
                    ),
                    "endTime": str(inst.getEndTime()) if inst.getEndTime() else None,
                }
            )
        return result

    @keyword
    @except_interop_exception
    def get_historic_variables(
        self, process_instance_id: str = ""
    ) -> dict[str, object]:
        """Returns historic variable instances as a dict with Python-native values.

        Defaults to the current instance in scope.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        history = self.ctx.engine.getHistoryService()
        variables = (
            history.createHistoricVariableInstanceQuery()
            .processInstanceId(instance_id)
            .list()
        )
        result: dict[str, object] = {}
        for i in range(int(variables.size())):
            var = variables.get(i)
            val: object = var.getValue()
            # Ensure value is Python-native for Remote protocol compatibility
            if val is not None and not isinstance(
                val, (str, int, float, bool, list, dict)
            ):
                val = str(val)
            result[str(var.getName())] = val
        return result

    @keyword
    @except_interop_exception
    def get_activity_history(
        self, process_instance_id: str = ""
    ) -> list[dict[str, str | bool]]:
        """Returns a list of historic activity instances as dicts.

        Each dict has: activityId, activityName, activityType, canceled, completed.
        Defaults to the current instance in scope.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        history = self.ctx.engine.getHistoryService()
        activities = (
            history.createHistoricActivityInstanceQuery()
            .processInstanceId(instance_id)
            .orderByHistoricActivityInstanceStartTime()
            .asc()
            .list()
        )
        result: list[dict[str, str | bool]] = []
        for i in range(int(activities.size())):
            act = activities.get(i)
            result.append(
                {
                    "activityId": str(act.getActivityId()),
                    "activityName": str(act.getActivityName() or ""),
                    "activityType": str(act.getActivityType()),
                    "canceled": bool(act.isCanceled()),
                    "completed": act.getEndTime() is not None,
                }
            )
        return result

    @keyword
    @except_interop_exception
    def get_process_model_xml(self, process_definition_id: str) -> str:
        """Returns the BPMN XML for the given process definition ID."""
        assert self.ctx.engine, "No engine"
        repository = self.ctx.engine.getRepositoryService()
        stream = repository.getProcessModel(process_definition_id)
        Scanner = java.type("java.util.Scanner")
        scanner = Scanner(stream, "UTF-8").useDelimiter("\\A")
        xml = str(scanner.next()) if scanner.hasNext() else ""
        scanner.close()
        return xml

    @keyword
    @except_interop_exception
    def get_process_definition_id(self, process_instance_id: str = "") -> str:
        """Returns the process definition ID for the process instance.

        Defaults to the current instance in scope.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        history = self.ctx.engine.getHistoryService()
        instance = (
            history.createHistoricProcessInstanceQuery()
            .processInstanceId(instance_id)
            .singleResult()
        )
        assert (
            instance is not None
        ), f"Process instance '{instance_id}' not found in history"
        return str(instance.getProcessDefinitionId())

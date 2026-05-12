from robot.api.deco import keyword
from typing import Any

from keywords.base import except_interop_exception

try:
    import java  # pyright: ignore
except ImportError:
    class java:
        @staticmethod
        def type(klass: str) -> Any:
            pass


class HistoryKeywords:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def get_completed_instances(self, process_definition_key: str = "") -> Any:
        """Returns a list of completed historic process instances."""
        assert self.ctx.engine, "No engine"
        history = self.ctx.engine.getHistoryService()
        query = history.createHistoricProcessInstanceQuery().finished()
        if process_definition_key:
            query = query.processDefinitionKey(process_definition_key)
        return query.list()

    @keyword
    @except_interop_exception
    def get_historic_variables(self, process_instance_id: str) -> Any:
        """Returns historic variable instances as a dict."""
        assert self.ctx.engine, "No engine"
        history = self.ctx.engine.getHistoryService()
        variables = history.createHistoricVariableInstanceQuery() \
            .processInstanceId(process_instance_id).list()
        result = {}
        for i in range(int(variables.size())):
            var = variables.get(i)
            result[str(var.getName())] = var.getValue()
        return result

    @keyword
    @except_interop_exception
    def get_activity_history(self, process_instance_id: str) -> list:
        """Returns a list of historic activity instances as dicts.

        Each dict has: activityId, activityName, activityType, canceled, completed.
        """
        assert self.ctx.engine, "No engine"
        history = self.ctx.engine.getHistoryService()
        activities = (history.createHistoricActivityInstanceQuery()
                      .processInstanceId(process_instance_id)
                      .orderByHistoricActivityInstanceStartTime().asc()
                      .list())
        result = []
        for i in range(int(activities.size())):
            act = activities.get(i)
            result.append({
                "activityId": str(act.getActivityId()),
                "activityName": str(act.getActivityName() or ""),
                "activityType": str(act.getActivityType()),
                "canceled": bool(act.isCanceled()),
                "completed": act.getEndTime() is not None,
            })
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
    def get_process_definition_id(self, process_instance_id: str) -> str:
        """Returns the process definition ID for a given process instance."""
        assert self.ctx.engine, "No engine"
        history = self.ctx.engine.getHistoryService()
        instance = (history.createHistoricProcessInstanceQuery()
                    .processInstanceId(process_instance_id)
                    .singleResult())
        assert instance is not None, (
            f"Process instance '{process_instance_id}' not found in history"
        )
        return str(instance.getProcessDefinitionId())

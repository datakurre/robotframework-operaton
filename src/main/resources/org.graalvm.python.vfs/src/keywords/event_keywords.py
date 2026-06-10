from robot.api.deco import keyword
from typing import Any

from keywords.base import Variables, except_interop_exception


class EventKeywords:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def correlate_message(
        self, message_name: str, process_instance_id: str = "", **variables: Any
    ):
        """Correlates a message to a process instance.

        Defaults to the current instance in scope; pass ``process_instance_id`` to target
        a specific instance or to correlate without an instance filter.
        """
        assert self.ctx.engine, "No engine"
        runtime = self.ctx.engine.getRuntimeService()
        builder = runtime.createMessageCorrelation(message_name)
        effective_id = process_instance_id or self.ctx._current_instance_id
        if effective_id:
            builder = builder.processInstanceId(effective_id)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.setVariables(var_map)
        builder.correlate()

    @keyword
    @except_interop_exception
    def send_message(
        self, message_name: str, process_instance_id: str = "", **variables: Any
    ):
        """Alias for Correlate Message."""
        self.correlate_message(message_name, process_instance_id, **variables)

    @keyword
    @except_interop_exception
    def signal_event(self, signal_name: str):
        """Sends a signal event to all waiting executions."""
        assert self.ctx.engine, "No engine"
        runtime = self.ctx.engine.getRuntimeService()
        runtime.signalEventReceived(signal_name)

    @keyword
    @except_interop_exception
    def throw_signal(self, signal_name: str):
        """Alias for Signal Event."""
        self.signal_event(signal_name)

    @keyword
    @except_interop_exception
    def should_have_incident(
        self, incident_type: str = "", process_instance_id: str = ""
    ) -> list:
        """Asserts that the process instance has at least one incident. Defaults to the current instance.

        Returns a list of incident dicts with: id, incidentType, activityId, message.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        query = runtime.createIncidentQuery().processInstanceId(instance_id)
        if incident_type:
            query = query.incidentType(incident_type)
        incidents = query.list()
        assert (
            int(incidents.size()) > 0
        ), f"No incidents found for process instance '{instance_id}'"
        result = []
        for i in range(int(incidents.size())):
            inc = incidents.get(i)
            result.append(
                {
                    "id": str(inc.getId()),
                    "incidentType": str(inc.getIncidentType()),
                    "activityId": (
                        str(inc.getActivityId()) if inc.getActivityId() else None
                    ),
                    "message": (
                        str(inc.getIncidentMessage())
                        if inc.getIncidentMessage()
                        else None
                    ),
                }
            )
        return result

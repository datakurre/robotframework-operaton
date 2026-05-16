from robot.api.deco import keyword
from typing import Any

from keywords.base import Variables, except_interop_exception


class EventKeywords:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def correlate_message(self, message_name: str, **variables: Any):
        """Correlates a message to the current process instance, or any waiting instance if none is set."""
        assert self.ctx.engine, "No engine"
        runtime = self.ctx.engine.getRuntimeService()
        builder = runtime.createMessageCorrelation(message_name)
        if self.ctx._current_instance_id:
            builder = builder.processInstanceId(self.ctx._current_instance_id)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.setVariables(var_map)
        builder.correlate()

    @keyword
    @except_interop_exception
    def send_message(self, message_name: str, **variables: Any):
        """Alias for Correlate Message."""
        self.correlate_message(message_name, **variables)

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
    def should_have_incident(self, incident_type: str = "") -> list:
        """Asserts that the current process instance has at least one incident.

        Returns a list of incident dicts with: id, incidentType, activityId, message.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
        runtime = self.ctx.engine.getRuntimeService()
        query = runtime.createIncidentQuery().processInstanceId(instance_id)
        if incident_type:
            query = query.incidentType(incident_type)
        incidents = query.list()
        assert int(incidents.size()) > 0, (
            f"No incidents found for process instance '{instance_id}'"
        )
        result = []
        for i in range(int(incidents.size())):
            inc = incidents.get(i)
            result.append({
                "id": str(inc.getId()),
                "incidentType": str(inc.getIncidentType()),
                "activityId": str(inc.getActivityId()) if inc.getActivityId() else None,
                "message": str(inc.getIncidentMessage()) if inc.getIncidentMessage() else None,
            })
        return result

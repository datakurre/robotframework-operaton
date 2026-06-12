import json

from robot.api import logger
from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import java, except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class BpmnKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def log_bpmn_execution(self, process_instance_id: str = "") -> None:
        """Renders the executed BPMN path as SVG and logs it to the Robot log.

        Fetches BPMN XML and activity history from the engine, then delegates to
        the bundled ``bpmn-render.js`` script (invoked via ``node``).

        Requires Node.js 18+ on PATH. If ``node`` is unavailable, logs a warning
        and returns without failing. Defaults to the current instance in scope.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)

        BpmnRenderer = java.type("org.operaton.bpm.extension.robot.BpmnRenderer")
        if not BpmnRenderer.isNodeAvailable():
            logger.warn(
                f"BPMN rendering skipped: 'node' not found on PATH "
                f"(process instance: {instance_id})"
            )
            return

        history = self.ctx.engine.getHistoryService()
        instance = (
            history.createHistoricProcessInstanceQuery()
            .processInstanceId(instance_id)
            .singleResult()
        )
        assert (
            instance is not None
        ), f"Process instance '{instance_id}' not found in history"
        process_def_id = str(instance.getProcessDefinitionId())

        # Fetch BPMN XML via RepositoryService
        repository = self.ctx.engine.getRepositoryService()
        stream = repository.getProcessModel(process_def_id)
        Scanner = java.type("java.util.Scanner")
        scanner = Scanner(stream, "UTF-8").useDelimiter("\\A")
        bpmn_xml = str(scanner.next()) if scanner.hasNext() else ""
        scanner.close()

        # Fetch activity history
        activities_raw = (
            history.createHistoricActivityInstanceQuery()
            .processInstanceId(instance_id)
            .orderByHistoricActivityInstanceStartTime()
            .asc()
            .list()
        )

        # Collect incident activity IDs
        incidents_raw = (
            history.createHistoricIncidentQuery().processInstanceId(instance_id).list()
        )
        incident_activity_ids = set()
        for i in range(int(incidents_raw.size())):
            inc = incidents_raw.get(i)
            incident_activity_ids.add(str(inc.getActivityId()))

        activities = []
        for i in range(int(activities_raw.size())):
            act = activities_raw.get(i)
            activities.append(
                {
                    "activityId": str(act.getActivityId()),
                    "activityType": str(act.getActivityType()),
                    "canceled": bool(act.isCanceled()),
                    "completed": act.getEndTime() is not None,
                    "incident": str(act.getActivityId()) in incident_activity_ids,
                }
            )

        input_json = json.dumps({"bpmn": bpmn_xml, "activities": activities})

        try:
            svg = str(BpmnRenderer.renderSvg(input_json))
            # Use print(*HTML*) so the message survives robotremoteserver's
            # StandardStreamInterceptor (RF 7.x logger writes to sys.__stdout__,
            # not sys.stdout, so logger.info(html=True) is silently dropped).
            print(
                f'*HTML* <div class="bpmn-execution" '
                f'style="max-width:100%;overflow:auto">{svg}</div>'
            )
        except Exception as exc:
            print(f"*WARN* BPMN rendering failed: {exc}")

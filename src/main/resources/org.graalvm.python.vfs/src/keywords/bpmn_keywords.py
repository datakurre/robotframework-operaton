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

    @keyword
    @except_interop_exception
    def log_bpmn_test_coverage(self, *definitions: str, console: bool = False) -> None:
        """Logs process test coverage to the Robot log.

        Prints an HTML table of every process definition exercised since
        ``Setup Process Engine`` together with its coverage percentage, and
        renders the covered paths of the requested definitions as highlighted SVGs.

        When no *definitions* are given, SVGs are rendered for **all** exercised
        definitions (same as listing them all explicitly).  Pass one or more
        definition keys to render only a subset.

        Use ``console=True`` to also print the table to the Robot console as a
        Markdown table (useful for quick terminal inspection).

        Coverage is collected by the ``operaton-process-test-coverage`` library,
        which must be on the classpath (it is bundled in both fat JARs). If the
        library is unavailable, the keyword logs a warning and returns without
        failing.

        Rendering the SVG additionally requires Node.js 18+ on PATH; if ``node``
        is unavailable the coverage table is still logged.

        Examples:
        | Log Bpmn Test Coverage |                          | # all definitions |
        | Log Bpmn Test Coverage | my-process               | # one definition  |
        | Log Bpmn Test Coverage | proc-a    | proc-b       | # two definitions |
        | Log Bpmn Test Coverage | console=True             | # Markdown table  |
        """
        assert self.ctx.engine, "No engine"
        collector = getattr(self.ctx, "coverage_collector", None)
        if collector is None:
            logger.warn(
                "BPMN test coverage skipped: the operaton-process-test-coverage "
                "library is not on the classpath."
            )
            return

        suite = collector.getActiveSuite()
        models = list(collector.getModels())

        # --- Build the coverage table (one row per exercised definition) ---
        table_rows = []
        for model in models:
            key = str(model.getKey())
            total = int(model.getTotalElementCount())
            covered = int(suite.getEventsDistinct(key).size())
            pct = float(suite.calculateCoverage(model)) * 100.0
            table_rows.append((key, covered, total, pct))

        def _pct_str(pct: float) -> str:
            # calculateCoverage returns NaN when a model has no elements
            return f"{pct:.1f}%" if pct == pct else "n/a"

        # Plain-text table written to the Robot log
        text_lines = [
            "Process test coverage:",
            f"{'Definition':<40} {'Covered':>8} {'Total':>6} {'Coverage':>9}",
        ]
        for key, covered, total, pct in table_rows:
            text_lines.append(f"{key:<40} {covered:>8} {total:>6} {_pct_str(pct):>9}")
        grand_total_covered = sum(covered for _, covered, _, _ in table_rows)
        grand_total_elements = sum(total for _, _, total, _ in table_rows)
        grand_total_pct = (
            float(grand_total_covered) / float(grand_total_elements) * 100.0
            if grand_total_elements
            else float("nan")
        )
        text_lines.append(
            f"TOTAL BPMN TEST COVERAGE: {_pct_str(grand_total_pct)} "
            f"({grand_total_covered}/{grand_total_elements})"
        )
        logger.info("\n".join(text_lines))
        print(
            f"TOTAL BPMN TEST COVERAGE: {_pct_str(grand_total_pct)} "
            f"({grand_total_covered}/{grand_total_elements})"
        )

        # HTML table for the Robot log
        html_rows = "".join(
            f"<tr><td>{key}</td>"
            f'<td style="text-align:right">{covered}</td>'
            f'<td style="text-align:right">{total}</td>'
            f'<td style="text-align:right">{_pct_str(pct)}</td></tr>'
            for key, covered, total, pct in table_rows
        )
        print(
            '*HTML* <table class="bpmn-coverage" border="1" '
            'style="border-collapse:collapse">'
            "<thead><tr><th>Definition</th><th>Covered</th><th>Total</th>"
            "<th>Coverage</th></tr></thead>"
            f"<tbody>{html_rows}</tbody></table>"
        )

        # Markdown table to the Robot console when requested
        if console:
            grand_total_row = (
                "Grand Total",
                grand_total_covered,
                grand_total_elements,
                _pct_str(grand_total_pct),
            )
            pct_strs = [_pct_str(pct) for _, _, _, pct in table_rows]
            w_key = max(
                len("Definition"),
                len(grand_total_row[0]),
                *(len(k) for k, *_ in table_rows),
                0,
            )
            w_cov = max(
                len("Covered"),
                len(str(grand_total_row[1])),
                *(len(str(c)) for _, c, *_ in table_rows),
                0,
            )
            w_tot = max(
                len("Total"),
                len(str(grand_total_row[2])),
                *(len(str(t)) for _, _, t, _ in table_rows),
                0,
            )
            w_pct = max(
                len("Coverage"), len(grand_total_row[3]), *(len(p) for p in pct_strs), 0
            )
            md_lines = [
                f"| {'Definition':<{w_key}} | {'Covered':>{w_cov}} | {'Total':>{w_tot}} | {'Coverage':>{w_pct}} |",
                f"| {'-' * w_key} | {'-' * (w_cov - 1)}: | {'-' * (w_tot - 1)}: | {'-' * (w_pct - 1)}: |",
            ]
            for (key, covered, total, _), pct_str in zip(table_rows, pct_strs):
                md_lines.append(
                    f"| {key:<{w_key}} | {covered:>{w_cov}} | {total:>{w_tot}} | {pct_str:>{w_pct}} |"
                )
            md_lines.append(
                f"| {grand_total_row[0]:<{w_key}} | {grand_total_row[1]:>{w_cov}} | {grand_total_row[2]:>{w_tot}} | {grand_total_row[3]:>{w_pct}} |"
            )
            print("*CONSOLE*\n" + "\n".join(md_lines))

        # When no definitions are requested, render all exercised models.
        if definitions:
            requested_definitions = []
            seen: set[str] = set()
            for definition in definitions:
                if definition and definition not in seen:
                    seen.add(definition)
                    requested_definitions.append(definition)
        else:
            requested_definitions = [str(m.getKey()) for m in models]

        if not requested_definitions:
            return

        BpmnRenderer = java.type("org.operaton.bpm.extension.robot.BpmnRenderer")
        if not BpmnRenderer.isNodeAvailable():
            logger.warn(
                "BPMN coverage SVG skipped: 'node' not found on PATH "
                f"(definitions: {', '.join(requested_definitions)})"
            )
            return

        for definition in requested_definitions:
            # --- Render the covered path of each requested definition as SVG ---
            model = next((m for m in models if str(m.getKey()) == definition), None)
            if model is None:
                logger.warn(
                    f"BPMN test coverage: no covered model found for definition "
                    f"'{definition}' (was it executed since Setup Process Engine?)."
                )
                continue

            bpmn_xml = str(model.getXml())

            covered_node_ids = set()
            for event in suite.getEvents(definition):
                if str(event.getSource()) == "FLOW_NODE":
                    covered_node_ids.add(str(event.getDefinitionKey()))

            # Covered flow nodes are highlighted as completed; sequence flows are
            # inferred from covered endpoints by the renderer.
            activities = [
                {
                    "activityId": node_id,
                    "activityType": "",
                    "canceled": False,
                    "completed": True,
                    "incident": False,
                }
                for node_id in covered_node_ids
            ]

            input_json = json.dumps({"bpmn": bpmn_xml, "activities": activities})
            try:
                svg = str(BpmnRenderer.renderSvg(input_json))
                print(
                    f"*HTML* <h4>BPMN Coverage: {definition}</h4>"
                    f'<div class="bpmn-coverage" '
                    f'style="max-width:100%;overflow:auto">{svg}</div>'
                )
            except Exception as exc:
                print(
                    f"*WARN* BPMN coverage rendering failed for '{definition}': {exc}"
                )

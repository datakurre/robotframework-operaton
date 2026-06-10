from robot.api.deco import keyword
from typing import TYPE_CHECKING

import json

from keywords.base import (
    DmnValue,
    Variables,
    VariableValue,
    java,
    except_interop_exception,
)


if TYPE_CHECKING:
    from Operaton import Operaton


DecisionRow = dict[str, DmnValue]
DecisionResult = list[DecisionRow]


class DmnKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def evaluate_decision(
        self, decision_key: str, **variables: VariableValue
    ) -> DecisionResult:
        """Evaluates a deployed DMN decision by key with the given input variables.

        Returns the full decision result as a list of dictionaries.
        Each entry in the list represents a matched rule's output values.

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            ${result}=    Evaluate Decision    discount    customerType=gold    orderTotal=1500
        """
        assert self.ctx.engine, "No engine"
        decision_service = self.ctx.engine.getDecisionService()
        builder = decision_service.evaluateDecisionByKey(decision_key)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.variables(var_map)
        dmn_result = builder.evaluate()
        result: DecisionResult = []
        for i in range(int(dmn_result.size())):
            entry = dmn_result.get(i)
            row: DecisionRow = {}
            entry_map = entry.getEntryMap()
            for key in entry_map.keySet():
                row[str(key)] = entry_map.get(key)  # type: ignore[assignment]  # GraalPy auto-boxes FEEL values
            result.append(row)
        return result

    @keyword
    @except_interop_exception
    def evaluate_decision_table(
        self, decision_key: str, **variables: VariableValue
    ) -> DecisionResult:
        """Evaluates a deployed DMN decision table by key with the given input variables.

        Returns the decision table result as a list of dictionaries.
        Use this when you specifically want to evaluate a decision table
        (as opposed to a literal expression or DRG).

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            ${result}=    Evaluate Decision Table    discount    customerType=gold
        """
        assert self.ctx.engine, "No engine"
        decision_service = self.ctx.engine.getDecisionService()
        builder = decision_service.evaluateDecisionTableByKey(decision_key)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.variables(var_map)
        dmn_result = builder.evaluate()
        result: DecisionResult = []
        for i in range(int(dmn_result.size())):
            entry = dmn_result.get(i)
            row: DecisionRow = {}
            entry_map = entry.getEntryMap()
            for key in entry_map.keySet():
                row[str(key)] = entry_map.get(key)  # type: ignore[assignment]  # GraalPy auto-boxes FEEL values
            result.append(row)
        return result

    @keyword
    @except_interop_exception
    def decision_result_should_contain(
        self, result: DecisionResult, output_name: str, expected_value: DmnValue
    ) -> None:
        """Asserts that at least one row in the decision result contains
        the expected value for the given output name.

        Example usage in Robot::

            ${result}=    Evaluate Decision    discount    customerType=gold
            Decision Result Should Contain    ${result}    discountPercent    15
        """
        values = [row.get(output_name) for row in result if output_name in row]
        matched = False
        for v in values:
            if str(v) == str(expected_value):
                matched = True
                break
        assert matched, (
            f"Expected output '{output_name}' to contain '{expected_value}', "
            f"but got values: {values}"
        )

    @keyword
    @except_interop_exception
    def decision_single_result(self, result: DecisionResult) -> DecisionRow:
        """Returns the single result row from a decision result.

        Asserts that exactly one rule matched.

        Example usage in Robot::

            ${result}=    Evaluate Decision    discount    customerType=gold
            ${row}=    Decision Single Result    ${result}
        """
        assert (
            len(result) == 1
        ), f"Expected exactly 1 matched rule, but got {len(result)}: {result}"
        return result[0]

    @keyword
    @except_interop_exception
    def decision_single_entry(self, result: DecisionResult) -> DmnValue:
        """Returns the single output value from a decision result with exactly
        one matched rule and one output column.

        Example usage in Robot::

            ${result}=    Evaluate Decision    discount    customerType=gold
            ${discount}=    Decision Single Entry    ${result}
            Should Be Equal As Numbers    ${discount}    15
        """
        assert (
            len(result) == 1
        ), f"Expected exactly 1 matched rule, but got {len(result)}: {result}"
        row = result[0]
        assert (
            len(row) == 1
        ), f"Expected exactly 1 output column, but got {len(row)}: {row}"
        return next(iter(row.values()))

    @keyword
    @except_interop_exception
    def collect_entries(
        self, result: DecisionResult, output_name: str
    ) -> list[DmnValue]:
        """Returns all values of a specific output column from a decision result.

        Extracts the value of the given output column from each matched rule.

        Example usage in Robot::

            ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
            ${benefits}=    Collect Entries    ${result}    benefit
        """
        return [row[output_name] for row in result if output_name in row]

    @keyword
    @except_interop_exception
    def should_have_decision_definition(self, decision_key: str) -> str:
        """Asserts that a decision definition with the given key is deployed.

        Returns the decision definition ID.

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            Should Have Decision Definition    discount
        """
        assert self.ctx.engine, "No engine"
        repository = self.ctx.engine.getRepositoryService()
        query = repository.createDecisionDefinitionQuery().decisionDefinitionKey(
            decision_key
        )
        result = query.singleResult()
        assert result is not None, f"Decision definition '{decision_key}' not found"
        return str(result.getId())

    @keyword
    @except_interop_exception
    def log_dmn_result(self, decision_key: str) -> None:
        """Renders the most recently evaluated DMN decision table as HTML and logs it.

        Shows the full decision table with matched/fired rules highlighted in green.
        Must be called after ``Evaluate Decision`` or ``Evaluate Decision Table``
        for the same decision key.

        Requires Node.js 18+ on PATH. If ``node`` is unavailable, logs a warning
        and returns without failing.

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            ${result}=    Evaluate Decision    discount    customerType=gold
            Log Dmn Result    discount
        """
        assert self.ctx.engine, "No engine"

        BpmnRenderer = java.type("org.operaton.bpm.extension.robot.BpmnRenderer")
        if not BpmnRenderer.isNodeAvailable():
            print(
                f"*WARN* DMN rendering skipped: 'node' not found on PATH "
                f"(decision: {decision_key})"
            )
            return

        # Get decision definition
        repository = self.ctx.engine.getRepositoryService()
        definition = (
            repository.createDecisionDefinitionQuery()
            .decisionDefinitionKey(decision_key)
            .latestVersion()
            .singleResult()
        )
        assert definition is not None, f"Decision definition '{decision_key}' not found"
        definition_id = str(definition.getId())

        # Fetch DMN XML
        stream = repository.getDecisionModel(definition_id)
        Scanner = java.type("java.util.Scanner")
        scanner = Scanner(stream, "UTF-8").useDelimiter("\\A")
        dmn_xml = str(scanner.next()) if scanner.hasNext() else ""
        scanner.close()

        # Query latest historic decision instance for matched rules
        history = self.ctx.engine.getHistoryService()
        instances = (
            history.createHistoricDecisionInstanceQuery()
            .decisionDefinitionKey(decision_key)
            .includeOutputs()
            .orderByEvaluationTime()
            .desc()
            .listPage(0, 1)
        )

        # getRuleOrder() returns the 1-based position of the matched rule in
        # the decision table (1-based Integer). This is used to highlight the
        # correct row in the renderer. Note: HISTORY_FULL engine level is
        # required for HistoricDecisionInstance outputs to be recorded.
        matched_orders = []
        if int(instances.size()) > 0:
            instance = instances.get(0)
            outputs = instance.getOutputs()
            seen = set()
            for i in range(int(outputs.size())):
                rule_order_raw = outputs.get(i).getRuleOrder()
                if rule_order_raw is not None:
                    order = int(rule_order_raw)
                    if order not in seen:
                        matched_orders.append(order)
                        seen.add(order)

        # Call Node.js renderer
        input_json = json.dumps(
            {
                "dmn": dmn_xml,
                "decisionId": decision_key,
                "matchedRules": matched_orders,
            }
        )

        try:
            html = str(BpmnRenderer.renderDmnHtml(input_json))
            # Use print(*HTML*) so the message survives robotremoteserver's
            # StandardStreamInterceptor (RF 7.x logger writes to sys.__stdout__,
            # not sys.stdout, so logger.info(html=True) is silently dropped).
            print(
                f'*HTML* <div class="dmn-result" '
                f'style="max-width:100%;overflow:auto">{html}</div>'
            )
        except Exception:
            import sys as _sys

            _exc = _sys.exc_info()[1]
            _msg = str(_exc) if _exc else "unknown error"
            try:
                if _exc is not None:
                    get_message = getattr(_exc, "getMessage", None)
                    if callable(get_message):
                        value = get_message()
                        if value:
                            _msg = str(value)
            except Exception:
                pass
            print(f"*WARN* DMN rendering failed: {_msg}")

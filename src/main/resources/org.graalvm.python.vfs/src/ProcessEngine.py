from robot.api.deco import library
from robot.api.deco import keyword
from pathlib import Path
from typing import Any
from functools import wraps

import sys
import os

try:
    import java  # pyright: ignore
except ImportError:
    # Fix typechecks outside graalpy
    class java:
        @staticmethod
        def type(klass: str) -> Any:
            pass


ProcessEngineConfiguration =\
    java.type("org.operaton.bpm.engine.ProcessEngineConfiguration")
assertThat: Any =\
     getattr(java.type("org.operaton.bpm.engine.test.assertions.bpmn.BpmnAwareTests"), "assertThat", None)
Variables = java.type("org.operaton.bpm.engine.variable.Variables")
ClockUtil = java.type("org.operaton.bpm.engine.impl.util.ClockUtil")


def except_interop_exception(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except:  # noqa
            exc_type, exc_value, exc_traceback = sys.exc_info()
            message = str(exc_value) if exc_value else "Unknown error"
            try:
                if hasattr(exc_value, 'getMessage'):
                    java_msg = exc_value.getMessage()
                    if java_msg:
                        message = str(java_msg)
                if hasattr(exc_value, 'getStackTrace'):
                    trace = exc_value.getStackTrace()
                    if trace:
                        frames = []
                        for elem in trace:
                            frames.append(str(elem))
                            if len(frames) >= 5:
                                break
                        if frames:
                            message += "\nJava stack trace:\n  " + "\n  ".join(frames)
            except Exception:
                pass
            assert False, message
    return wrapper



@library(scope="GLOBAL")
class ProcessEngine:
    engine: Any = None

    @keyword
    @except_interop_exception
    def setup_process_engine(self) -> Any:
        if self.engine is None:
            self.engine = (
                ProcessEngineConfiguration.createStandaloneInMemProcessEngineConfiguration().buildProcessEngine()
            )
        return self.engine

    @keyword
    @except_interop_exception
    def teardown_process_engine(self):
        self.engine.close()
        self.engine = None

    @keyword
    @except_interop_exception
    def deploy_resources(self, *paths: str, name: str = "Test Deployment") -> Any:
        assert self.engine, "No engine"
        repository = self.engine.getRepositoryService()
        deployment = repository.createDeployment()
        for path in paths:
            deployment.addString(
                os.path.basename(path),
                Path(path).read_text(),
            )
        deployment.name(name)
        deployment.deploy()
        return deployment
    
    @keyword
    @except_interop_exception
    def start_instance(self, process_definition_key: str) -> str:
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        instance = runtime.startProcessInstanceByKey(process_definition_key)
        assertThat(instance).isStarted()
        return instance.getId()

    @keyword
    @except_interop_exception
    def should_have_task(self, process_instance_id: str, task_defintion_key: str):
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        query = runtime.createProcessInstanceQuery()
        query.processInstanceId(process_instance_id)
        instance = query.singleResult()
        assertThat(instance).task().hasDefinitionKey(task_defintion_key)

    @keyword
    @except_interop_exception
    def complete_task(self, process_instance_id: str, task_definition_key: str = "", variables: Any = None):
        assert self.engine, "No engine"
        task_service = self.engine.getTaskService()
        query = task_service.createTaskQuery().processInstanceId(process_instance_id)
        if task_definition_key:
            query = query.taskDefinitionKey(task_definition_key)
        task = query.singleResult()
        assert task, f"No task found for instance {process_instance_id}"
        if variables:
            task_service.complete(task.getId(), variables)
        else:
            task_service.complete(task.getId())

    @keyword
    @except_interop_exception
    def get_variable(self, process_instance_id: str, variable_name: str) -> Any:
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        return runtime.getVariable(process_instance_id, variable_name)

    @keyword
    @except_interop_exception
    def set_variable(self, process_instance_id: str, variable_name: str, variable_value: Any):
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        runtime.setVariable(process_instance_id, variable_name, variable_value)

    @keyword
    @except_interop_exception
    def get_tasks(self, process_instance_id: str) -> Any:
        assert self.engine, "No engine"
        task_service = self.engine.getTaskService()
        return task_service.createTaskQuery().processInstanceId(process_instance_id).list()

    # ── Process Instance Assertions ─────────────────────────────────────

    @keyword
    @except_interop_exception
    def start_instance_with_variables(self, process_definition_key: str, **variables: Any) -> str:
        """Starts a process instance with the given variables."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            instance = runtime.startProcessInstanceByKey(process_definition_key, var_map)
        else:
            instance = runtime.startProcessInstanceByKey(process_definition_key)
        assertThat(instance).isStarted()
        return instance.getId()

    @keyword
    @except_interop_exception
    def should_be_ended(self, process_instance_id: str):
        """Asserts that the process instance has ended."""
        assert self.engine, "No engine"
        history = self.engine.getHistoryService()
        instance = history.createHistoricProcessInstanceQuery() \
            .processInstanceId(process_instance_id).singleResult()
        assert instance is not None, (
            f"Process instance '{process_instance_id}' not found in history"
        )
        assert instance.getEndTime() is not None, (
            f"Process instance '{process_instance_id}' has not ended"
        )

    @keyword
    @except_interop_exception
    def should_be_active(self, process_instance_id: str):
        """Asserts that the process instance is currently active."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        instance = runtime.createProcessInstanceQuery() \
            .processInstanceId(process_instance_id).singleResult()
        assert instance is not None, (
            f"Process instance '{process_instance_id}' not found or has ended"
        )
        assert not instance.isSuspended(), (
            f"Process instance '{process_instance_id}' is suspended, not active"
        )

    @keyword
    @except_interop_exception
    def should_be_suspended(self, process_instance_id: str):
        """Asserts that the process instance is suspended."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        instance = runtime.createProcessInstanceQuery() \
            .processInstanceId(process_instance_id).singleResult()
        assert instance is not None, (
            f"Process instance '{process_instance_id}' not found or has ended"
        )
        assert instance.isSuspended(), (
            f"Process instance '{process_instance_id}' is not suspended"
        )

    @keyword
    @except_interop_exception
    def suspend_instance(self, process_instance_id: str):
        """Suspends a running process instance."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        runtime.suspendProcessInstanceById(process_instance_id)

    @keyword
    @except_interop_exception
    def activate_instance(self, process_instance_id: str):
        """Activates a suspended process instance."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        runtime.activateProcessInstanceById(process_instance_id)

    @keyword
    @except_interop_exception
    def should_have_n_active_tasks(self, process_instance_id: str, expected_count: Any):
        """Asserts that the process instance has exactly N active tasks."""
        assert self.engine, "No engine"
        task_service = self.engine.getTaskService()
        tasks = task_service.createTaskQuery() \
            .processInstanceId(process_instance_id).list()
        actual = int(tasks.size())
        expected = int(expected_count)
        assert actual == expected, (
            f"Expected {expected} active tasks, but found {actual}"
        )

    # ── Event Keywords ──────────────────────────────────────────────────

    @keyword
    @except_interop_exception
    def correlate_message(self, message_name: str, process_instance_id: str = "", **variables: Any):
        """Correlates a message to a waiting process instance."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        builder = runtime.createMessageCorrelation(message_name)
        if process_instance_id:
            builder = builder.processInstanceId(process_instance_id)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.setVariables(var_map)
        builder.correlate()

    @keyword
    @except_interop_exception
    def send_message(self, message_name: str, process_instance_id: str = "", **variables: Any):
        """Alias for Correlate Message."""
        self.correlate_message(message_name, process_instance_id, **variables)

    @keyword
    @except_interop_exception
    def signal_event(self, signal_name: str):
        """Sends a signal event to all waiting executions."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        runtime.signalEventReceived(signal_name)

    @keyword
    @except_interop_exception
    def throw_signal(self, signal_name: str):
        """Alias for Signal Event."""
        self.signal_event(signal_name)

    @keyword
    @except_interop_exception
    def should_have_incident(self, process_instance_id: str, incident_type: str = ""):
        """Asserts that the process instance has at least one incident."""
        assert self.engine, "No engine"
        runtime = self.engine.getRuntimeService()
        query = runtime.createIncidentQuery().processInstanceId(process_instance_id)
        if incident_type:
            query = query.incidentType(incident_type)
        incidents = query.list()
        assert int(incidents.size()) > 0, (
            f"No incidents found for process instance '{process_instance_id}'"
        )
        return incidents

    # ── History Keywords ────────────────────────────────────────────────

    @keyword
    @except_interop_exception
    def get_completed_instances(self, process_definition_key: str = "") -> Any:
        """Returns a list of completed historic process instances."""
        assert self.engine, "No engine"
        history = self.engine.getHistoryService()
        query = history.createHistoricProcessInstanceQuery().finished()
        if process_definition_key:
            query = query.processDefinitionKey(process_definition_key)
        return query.list()

    @keyword
    @except_interop_exception
    def get_historic_variables(self, process_instance_id: str) -> Any:
        """Returns historic variable instances as a dict."""
        assert self.engine, "No engine"
        history = self.engine.getHistoryService()
        variables = history.createHistoricVariableInstanceQuery() \
            .processInstanceId(process_instance_id).list()
        result = {}
        for i in range(int(variables.size())):
            var = variables.get(i)
            result[str(var.getName())] = var.getValue()
        return result

    # ── DMN (Decision Model and Notation) Keywords ──────────────────────

    @keyword
    @except_interop_exception
    def evaluate_decision(self, decision_key: str, **variables: Any) -> Any:
        """Evaluates a deployed DMN decision by key with the given input variables.

        Returns the full decision result as a list of dictionaries.
        Each entry in the list represents a matched rule's output values.

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            ${result}=    Evaluate Decision    discount    customerType=gold    orderTotal=1500
        """
        assert self.engine, "No engine"
        decision_service = self.engine.getDecisionService()
        builder = decision_service.evaluateDecisionByKey(decision_key)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.variables(var_map)
        dmn_result = builder.evaluate()
        # Convert to Python list of dicts for easier assertion
        result = []
        for i in range(dmn_result.size()):
            entry = dmn_result.get(i)
            row = {}
            entry_map = entry.getEntryMap()
            for key in entry_map.keySet():
                row[str(key)] = entry_map.get(key)
            result.append(row)
        return result

    @keyword
    @except_interop_exception
    def evaluate_decision_table(self, decision_key: str, **variables: Any) -> Any:
        """Evaluates a deployed DMN decision table by key with the given input variables.

        Returns the decision table result as a list of dictionaries.
        Use this when you specifically want to evaluate a decision table
        (as opposed to a literal expression or DRG).

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            ${result}=    Evaluate Decision Table    discount    customerType=gold
        """
        assert self.engine, "No engine"
        decision_service = self.engine.getDecisionService()
        builder = decision_service.evaluateDecisionTableByKey(decision_key)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.variables(var_map)
        dmn_result = builder.evaluate()
        # Convert to Python list of dicts
        result = []
        for i in range(dmn_result.size()):
            entry = dmn_result.get(i)
            row = {}
            entry_map = entry.getEntryMap()
            for key in entry_map.keySet():
                row[str(key)] = entry_map.get(key)
            result.append(row)
        return result

    @keyword
    @except_interop_exception
    def decision_result_should_contain(self, result: Any, output_name: str, expected_value: Any):
        """Asserts that at least one row in the decision result contains
        the expected value for the given output name.

        Example usage in Robot::

            ${result}=    Evaluate Decision    discount    customerType=gold
            Decision Result Should Contain    ${result}    discountPercent    15
        """
        values = [row.get(output_name) for row in result if output_name in row]
        # Convert expected_value to match types (Robot passes strings)
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
    def decision_single_result(self, result: Any) -> Any:
        """Returns the single result row from a decision result.

        Asserts that exactly one rule matched.

        Example usage in Robot::

            ${result}=    Evaluate Decision    discount    customerType=gold
            ${row}=    Decision Single Result    ${result}
        """
        assert len(result) == 1, (
            f"Expected exactly 1 matched rule, but got {len(result)}: {result}"
        )
        return result[0]

    @keyword
    @except_interop_exception
    def decision_single_entry(self, result: Any) -> Any:
        """Returns the single output value from a decision result with exactly
        one matched rule and one output column.

        Example usage in Robot::

            ${result}=    Evaluate Decision    discount    customerType=gold
            ${discount}=    Decision Single Entry    ${result}
            Should Be Equal As Numbers    ${discount}    15
        """
        assert len(result) == 1, (
            f"Expected exactly 1 matched rule, but got {len(result)}: {result}"
        )
        row = result[0]
        assert len(row) == 1, (
            f"Expected exactly 1 output column, but got {len(row)}: {row}"
        )
        return next(iter(row.values()))

    @keyword
    @except_interop_exception
    def collect_entries(self, result: Any, output_name: str) -> Any:
        """Returns all values of a specific output column from a decision result.

        Extracts the value of the given output column from each matched rule.

        Example usage in Robot::

            ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
            ${benefits}=    Collect Entries    ${result}    benefit
        """
        return [row[output_name] for row in result if output_name in row]

    @keyword
    @except_interop_exception
    def should_have_decision_definition(self, decision_key: str) -> Any:
        """Asserts that a decision definition with the given key is deployed.

        Example usage in Robot::

            Deploy Resources    ${CURDIR}${/}discount.dmn
            Should Have Decision Definition    discount
        """
        assert self.engine, "No engine"
        repository = self.engine.getRepositoryService()
        query = repository.createDecisionDefinitionQuery() \
            .decisionDefinitionKey(decision_key)
        result = query.singleResult()
        assert result is not None, (
            f"Decision definition '{decision_key}' not found"
        )
        return result

    # ── Typed Variable Keywords ─────────────────────────────────────────

    @keyword
    @except_interop_exception
    def create_integer_variable(self, value: Any) -> Any:
        """Creates a Java Integer value for typed DMN/process variable input.

        Example usage in Robot::

            ${total}=    Create Integer Variable    1500
            ${result}=    Evaluate Decision    order-priority    orderTotal=${total}
        """
        Integer = java.type("java.lang.Integer")
        return Integer.valueOf(int(str(value)))

    @keyword
    @except_interop_exception
    def create_double_variable(self, value: Any) -> Any:
        """Creates a Java Double value for typed DMN/process variable input.

        Example usage in Robot::

            ${price}=    Create Double Variable    99.99
        """
        Double = java.type("java.lang.Double")
        return Double.valueOf(float(str(value)))

    @keyword
    @except_interop_exception
    def create_boolean_variable(self, value: Any) -> Any:
        """Creates a Java Boolean value for typed DMN/process variable input.

        Example usage in Robot::

            ${flag}=    Create Boolean Variable    true
        """
        Boolean = java.type("java.lang.Boolean")
        if isinstance(value, str):
            return Boolean.valueOf(value.lower() in ("true", "yes", "1"))
        return Boolean.valueOf(bool(value))

    @keyword
    @except_interop_exception
    def create_date_variable(self, value: Any, pattern: str = "yyyy-MM-dd") -> Any:
        """Creates a Java Date value for typed DMN/process variable input.

        Example usage in Robot::

            ${date}=    Create Date Variable    2025-01-15
        """
        SimpleDateFormat = java.type("java.text.SimpleDateFormat")
        sdf = SimpleDateFormat(pattern)
        return sdf.parse(str(value))

    # ── Timer Keywords ──────────────────────────────────────────────────

    @keyword
    @except_interop_exception
    def set_clock(self, date_string: str, pattern: str = "yyyy-MM-dd'T'HH:mm:ss"):
        """Sets the process engine clock to a specific date/time.

        Example usage in Robot::

            Set Clock    2025-06-15T10:00:00
        """
        SimpleDateFormat = java.type("java.text.SimpleDateFormat")
        sdf = SimpleDateFormat(pattern)
        date = sdf.parse(date_string)
        ClockUtil.setCurrentTime(date)

    @keyword
    @except_interop_exception
    def advance_clock(self, milliseconds: Any):
        """Advances the process engine clock by the given number of milliseconds.

        Example usage in Robot::

            Advance Clock    3600000
        """
        Calendar = java.type("java.util.Calendar")
        current = ClockUtil.getCurrentTime()
        cal = Calendar.getInstance()
        cal.setTime(current)
        cal.add(Calendar.MILLISECOND, int(str(milliseconds)))
        ClockUtil.setCurrentTime(cal.getTime())

    @keyword
    @except_interop_exception
    def reset_clock(self):
        """Resets the process engine clock to the current system time.

        Example usage in Robot::

            Reset Clock
        """
        ClockUtil.reset()

    @keyword
    @except_interop_exception
    def execute_timer_jobs(self, process_instance_id: str = ""):
        """Executes all timer jobs, optionally filtered by process instance.

        Example usage in Robot::

            Execute Timer Jobs
            Execute Timer Jobs    ${instance_id}
        """
        assert self.engine, "No engine"
        management = self.engine.getManagementService()
        query = management.createJobQuery().timers()
        if process_instance_id:
            query = query.processInstanceId(process_instance_id)
        jobs = query.list()
        for i in range(int(jobs.size())):
            job = jobs.get(i)
            management.executeJob(job.getId())

    # ── External Task Keywords ──────────────────────────────────────────

    @keyword
    @except_interop_exception
    def fetch_and_lock(self, topic: str, worker_id: str = "robot-worker",
                       max_tasks: Any = 1, lock_duration: Any = 10000):
        """Fetches and locks external tasks for the given topic.

        Returns a list of external task IDs.

        Example usage in Robot::

            ${tasks}=    Fetch And Lock    myTopic
        """
        assert self.engine, "No engine"
        external_task_service = self.engine.getExternalTaskService()
        tasks = external_task_service.fetchAndLock(
            int(str(max_tasks)), worker_id
        ).topic(topic, int(str(lock_duration))).execute()
        result = []
        for i in range(int(tasks.size())):
            result.append(str(tasks.get(i).getId()))
        return result

    @keyword
    @except_interop_exception
    def complete_external_task(self, external_task_id: str,
                               worker_id: str = "robot-worker", **variables: Any):
        """Completes an external task by its ID.

        Example usage in Robot::

            ${tasks}=    Fetch And Lock    myTopic
            ${task_id}=    Get From List    ${tasks}    0
            Complete External Task    ${task_id}
        """
        assert self.engine, "No engine"
        external_task_service = self.engine.getExternalTaskService()
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            external_task_service.complete(external_task_id, worker_id, var_map)
        else:
            external_task_service.complete(external_task_id, worker_id)

    @keyword
    @except_interop_exception
    def throw_bpmn_error(self, external_task_id: str, error_code: str,
                         error_message: str = "",
                         worker_id: str = "robot-worker"):
        """Throws a BPMN error for an external task, triggering error boundary events.

        Example usage in Robot::

            ${tasks}=    Fetch And Lock    myTopic
            ${task_id}=    Get From List    ${tasks}    0
            Throw Bpmn Error    ${task_id}    ERROR_CODE
        """
        assert self.engine, "No engine"
        external_task_service = self.engine.getExternalTaskService()
        external_task_service.handleBpmnError(
            external_task_id, worker_id, error_code, error_message
        )

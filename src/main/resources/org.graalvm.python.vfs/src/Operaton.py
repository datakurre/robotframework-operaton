from robot.api.deco import keyword
from pathlib import Path
from typing import Any

import os
import uuid

from robotlibcore import DynamicCore

from keywords.base import Variables, except_interop_exception, with_authenticated_user
from keywords.process_assertions import ProcessAssertions
from keywords.event_keywords import EventKeywords
from keywords.history_keywords import HistoryKeywords
from keywords.dmn_keywords import DmnKeywords
from keywords.typed_variables import TypedVariables
from keywords.timer_keywords import TimerKeywords
from keywords.external_task_keywords import ExternalTaskKeywords
from keywords.bpmn_keywords import BpmnKeywords
from keywords.form_keywords import FormKeywords

try:
    import java  # pyright: ignore
except ImportError:
    # Fix typechecks outside graalpy
    class java:
        @staticmethod
        def type(klass: str) -> Any:
            pass


ProcessEngineConfiguration = (
    java.type("org.operaton.bpm.engine.ProcessEngineConfiguration"))
assertThat: Any = (
    getattr(java.type("org.operaton.bpm.engine.test.assertions.bpmn.BpmnAwareTests"), "assertThat", None))
FlowNode = java.type("org.operaton.bpm.model.bpmn.instance.FlowNode")

try:
    _SpinPlugin = java.type("org.operaton.spin.plugin.impl.SpinProcessEnginePlugin")
except Exception:
    _SpinPlugin = None

try:
    _VasaraPlugin = java.type("fi.jyu.vasara.VasaraPlugin")
except Exception:
    _VasaraPlugin = None


class Operaton(DynamicCore):
    """Robot Framework keyword library for acceptance-testing Operaton BPM processes and DMN decisions.

    = Overview =

    The ``Operaton`` library provides a comprehensive set of keywords for deploying and executing
    BPMN processes and DMN decision tables against an in-memory Operaton process engine. It is
    designed for use in acceptance tests where business logic encoded in BPMN/DMN must be verified
    end-to-end without any external infrastructure.

    The engine is created in-memory (H2) when ``Setup Process Engine`` is called and torn down by
    ``Teardown Process Engine``. The typical pattern is to call these in the test ``[Setup]`` and
    ``[Teardown]`` sections respectively.

    = Quick Start =

    A minimal test suite looks like this:

    | ``*** Settings ***``
    | Library    Operaton
    |
    | ``*** Test Cases ***``
    | Order Process Happy Path
    |     [Setup]    Setup Process Engine
    |     [Teardown]    Teardown Process Engine
    |     Deploy Resources    ${CURDIR}${/}order-process.bpmn
    |     Start Instance    order-process    business_key=order-001
    |     Should Have Task    Review Order
    |     Complete Task    Review Order
    |     Should Be Ended

    The library automatically tracks the instance started by ``Start Instance``, so
    task and variable keywords work without an explicit instance ID in most tests.

    = Current Instance State =

    After ``Start Instance`` or ``Start Instance With Variables``, the library stores the instance
    ID and business key as *current instance state*. All keywords that accept an optional
    ``process_instance_id`` argument will automatically use the current instance when the argument is
    omitted, so you rarely need to capture the return value explicitly.

    If no ``business_key`` is supplied to ``Start Instance``, a UUID4 is generated automatically.
    The state is cleared when ``Teardown Process Engine`` runs.

    Use ``Get Current Instance`` and ``Get Current Business Key`` to inspect the stored values.

    When you need to work with multiple concurrent instances in one test (uncommon), pass the
    saved ID explicitly as the optional trailing ``process_instance_id`` argument available on
    all task, variable, state, and history keywords:

    | ${a}=    Start Instance    my-process
    | ${b}=    Start Instance    my-process
    | Should Have Task    say-hello    ${a}
    | Complete Task    say-hello    ${b}
    | Should Be Ended    ${a}    # note: a is still active here — just an example

    For task keywords the argument order is ``(name, process_instance_id)``;
    for variable keywords it is ``(variable_name, [variable_value,] process_instance_id)``.

    = Task Identification =

    Keywords that accept a task definition key (``Should Have Task``, ``Complete Task``,
    ``Submit Task Form``, ``Get Task Form Variables``) also accept a human-readable *task name*
    as shown in the BPMN modeller. For example, if the task element has ``name="Review Order"``,
    you can pass that string directly instead of the technical ``id`` attribute.

    If more than one active task shares the same name on the same instance, an error is raised —
    use the definition key in that case.

    = Deploying Resources =

    ``Deploy Resources`` accepts one or more absolute paths to ``.bpmn`` and ``.dmn`` files and
    deploys them in a single deployment. Use Robot's ``${CURDIR}${/}`` prefix to build portable
    paths relative to the test suite file:

    | Deploy Resources    ${CURDIR}${/}my-process.bpmn    ${CURDIR}${/}my-rules.dmn

    = Keyword Groups =

    | *Group*              | *Keywords*                                                        |
    | Engine lifecycle     | Setup Process Engine, Teardown Process Engine, Deploy Resources   |
    | Process instances    | Start Instance, Start Instance With Variables, Get Current Instance, Get Current Business Key |
    | User tasks           | Should Have Task, Complete Task, Get Tasks                        |
    | Process variables    | Get Process Variable, Set Process Variable                        |
    | Process state        | Should Be Active, Should Be Ended, Should Be Suspended, Suspend Instance, Activate Instance, Should Have Active, Should Have Completed |
    | History              | Get Activity History, Get Historic Variables, Get Completed Instances, Get Process Definition Id, Get Process Model Xml |
    | Events               | Correlate Message, Send Message, Signal Event, Throw Signal, Should Have Incident |
    | External tasks       | Fetch And Lock, Complete External Task, Throw Bpmn Error          |
    | DMN decisions        | Evaluate Decision, Evaluate Decision Table, Decision Single Result, Decision Single Entry, Decision Result Should Contain, Collect Entries, Should Have Decision Definition |
    | Forms                | Submit Task Form, Get Task Form Variables                         |
    | Typed variables      | Create Integer Variable, Create Double Variable, Create Boolean Variable, Create Date Variable |
    | Timers               | Set Clock, Advance Clock, Reset Clock, Execute Timer Jobs         |
    | Visualisation        | Log Bpmn Execution, Log Dmn Result                                |

    = Installation =

    The library is packaged as a fat JAR (``operaton-robot-*.jar``) that bundles GraalPy,
    Robot Framework, and the Operaton engine. Run it with:

    | java -jar operaton-robot.jar path/to/MyTests.robot

    A CPython proxy wheel (``robotframework-operaton``) is also available for IDE integration via
    RobotCode / VS Code, forwarding keyword calls to a running Remote server.

    See the project README for full setup and configuration instructions.
    """

    ROBOT_LIBRARY_SCOPE = "GLOBAL"

    engine: Any = None
    _current_instance_id: str = ""
    _current_business_key: str = ""

    def __init__(self):
        components = [
            ProcessAssertions(self),
            EventKeywords(self),
            HistoryKeywords(self),
            DmnKeywords(self),
            TypedVariables(self),
            TimerKeywords(self),
            ExternalTaskKeywords(self),
            BpmnKeywords(self),
            FormKeywords(self),
        ]
        DynamicCore.__init__(self, components)

    @keyword
    @except_interop_exception
    def setup_process_engine(self) -> Any:
        if self.engine is None:
            config = (
                ProcessEngineConfiguration.createStandaloneInMemProcessEngineConfiguration()
                .setHistory(ProcessEngineConfiguration.HISTORY_FULL)
                .setHostname("localhost")
            )
            # Always register the Spin plugin so JSON/XML serialization is available.
            if _SpinPlugin is not None:
                config.getProcessEnginePlugins().add(_SpinPlugin())
            # When running from the vasara fat JAR, activate Vasara form customizations
            # automatically by classpath-presence of fi.jyu.vasara.VasaraPlugin.
            if _VasaraPlugin is not None:
                config.getProcessEnginePlugins().add(_VasaraPlugin())
            self.engine = config.buildProcessEngine()
        return self.engine

    def _resolve_instance_id(self, process_instance_id: str = "") -> str:
        """Return the effective process instance ID.

        Resolution order:
        1. Explicit ``process_instance_id`` argument (if non-empty).
        2. The current instance stored in ``_current_instance_id``.
        3. Query all active/historic instances with ``_current_business_key``
           (exactly 1 must match).
        """
        if process_instance_id:
            return process_instance_id
        if self._current_instance_id:
            return self._current_instance_id
        if self._current_business_key:
            assert self.engine, "No engine"
            # Try runtime (active) first
            runtime = self.engine.getRuntimeService()
            results = (runtime.createProcessInstanceQuery()
                       .processInstanceBusinessKey(self._current_business_key)
                       .list())
            count = int(results.size())
            if count == 1:
                return str(results.get(0).getId())
            if count > 1:
                raise AssertionError(
                    f"Multiple active instances share business key "
                    f"'{self._current_business_key}' — please pass process_instance_id explicitly"
                )
            # Fall back to history (ended instances)
            history = self.engine.getHistoryService()
            hist_results = (history.createHistoricProcessInstanceQuery()
                            .processInstanceBusinessKey(self._current_business_key)
                            .list())
            hist_count = int(hist_results.size())
            if hist_count == 1:
                return str(hist_results.get(0).getId())
            if hist_count > 1:
                raise AssertionError(
                    f"Multiple historic instances share business key "
                    f"'{self._current_business_key}' — please pass process_instance_id explicitly"
                )
        raise AssertionError(
            "No process_instance_id given and no current instance in scope. "
            "Call 'Start Instance' first, or pass process_instance_id explicitly."
        )

    def _resolve_task_key(self, instance_id: str, key_or_name: str) -> str:
        """Return the task definition key for *key_or_name* within *instance_id*.

        If *key_or_name* matches a task by definition key, it is returned unchanged.
        Otherwise it is treated as a task **name**: exactly one task must have that
        name, and its definition key is returned. If multiple tasks share the name,
        an error is raised.
        """
        if not key_or_name:
            return ""
        assert self.engine, "No engine"
        task_service = self.engine.getTaskService()
        by_key = (task_service.createTaskQuery()
                  .processInstanceId(instance_id)
                  .taskDefinitionKey(key_or_name)
                  .list())
        if int(by_key.size()) > 0:
            # It's already a definition key
            return key_or_name
        # Try matching by name
        by_name = (task_service.createTaskQuery()
                   .processInstanceId(instance_id)
                   .taskName(key_or_name)
                   .list())
        name_count = int(by_name.size())
        assert name_count > 0, (
            f"No task with definition key or name '{key_or_name}' "
            f"found for instance '{instance_id}'"
        )
        assert name_count == 1, (
            f"Ambiguous task name '{key_or_name}': {name_count} tasks match "
            f"for instance '{instance_id}' — use the definition key instead"
        )
        return str(by_name.get(0).getTaskDefinitionKey())
    
    def _resolve_activity_id(self, process_definition_key: str, id_or_name: str) -> str:
        """Return the BPMN flow-node id for *id_or_name* within *process_definition_key*.

        If *id_or_name* already matches a deployed flow-node id, it is returned
        unchanged. Otherwise it is treated as the BPMN element name and must
        resolve to exactly one flow node in the latest deployed process definition.
        """
        if not id_or_name:
            return ""
        assert self.engine, "No engine"

        repository = self.engine.getRepositoryService()
        process_definition = (
            repository.createProcessDefinitionQuery()
            .processDefinitionKey(process_definition_key)
            .latestVersion()
            .singleResult()
        )
        assert process_definition is not None, (
            f"No process definition with key '{process_definition_key}' is deployed"
        )

        model = repository.getBpmnModelInstance(str(process_definition.getId()))
        assert model is not None, (
            f"No BPMN model found for process '{process_definition_key}'"
        )

        flow_nodes = model.getModelElementsByType(FlowNode)
        matches = []
        for i in range(int(flow_nodes.size())):
            flow_node = flow_nodes.get(i)
            flow_node_id = str(flow_node.getId())
            if flow_node_id == id_or_name:
                return flow_node_id

            name = flow_node.getName()
            if name and str(name) == id_or_name:
                matches.append(flow_node_id)

        assert matches, (
            f"No activity with id or name '{id_or_name}' found in process "
            f"'{process_definition_key}'"
        )
        assert len(matches) == 1, (
            f"Ambiguous activity name '{id_or_name}' in process "
            f"'{process_definition_key}': matched ids {matches} - use the activity id instead"
        )
        return matches[0]

    @keyword
    @except_interop_exception
    def teardown_process_engine(self):
        self.engine.close()
        self.engine = None
        self._current_instance_id = ""
        self._current_business_key = ""

    @keyword
    @except_interop_exception
    def deploy_resources(self, *paths: str, name: str = "Test Deployment") -> str:
        """Deploys BPMN/DMN resources to the engine.

        Returns the deployment ID.
        """
        assert self.engine, "No engine"
        repository = self.engine.getRepositoryService()
        deployment = repository.createDeployment()
        for path in paths:
            deployment.addString(
                os.path.basename(path),
                Path(path).read_text(),
            )
        deployment.name(name)
        result = deployment.deploy()
        return str(result.getId())

    @keyword
    @except_interop_exception
    def get_current_instance(self) -> str:
        """Returns the ID of the current process instance set by the last Start Instance call."""
        return self._current_instance_id

    @keyword
    @except_interop_exception
    def get_current_business_key(self) -> str:
        """Returns the business key of the current process instance."""
        return self._current_business_key

    @keyword
    @except_interop_exception
    @with_authenticated_user
    def start_instance(self, process_definition_key: str, business_key: str = "", user_id: str = "") -> str:
        """Starts a process instance and stores it as the current instance.

        If *business_key* is not provided, a UUID4 is generated automatically.
        The instance ID and business key are stored in test scope state and used
        automatically by subsequent keywords that accept ``process_instance_id``.

        If *user_id* is provided, it is set as the authenticated user on the engine
        before the instance is started. 
        This is required for the engine to populate initiator variables defined on the BPMN start event
        (e.g. ``camunda:initiator="author"`` stores user_id in the ``author``
        process variable).
        """
        assert self.engine, "No engine"
        if not business_key:
            business_key = str(uuid.uuid4())
        runtime = self.engine.getRuntimeService()
        instance = runtime.startProcessInstanceByKey(process_definition_key, business_key)
        assertThat(instance).isStarted()
        self._current_instance_id = str(instance.getId())
        self._current_business_key = business_key
        return self._current_instance_id

    @keyword
    @except_interop_exception
    def should_have_task(self, name: str = "", process_instance_id: str = ""):
        """Asserts that the process instance has an active task.

        Uses the current instance in scope (set by ``Start Instance``) unless
        ``process_instance_id`` is provided explicitly.
        The task may be identified by its definition key *or* by its human-readable name.
        When *name* is omitted, asserts that at least one active task exists.
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        resolved_key = self._resolve_task_key(instance_id, name)
        task_service = self.engine.getTaskService()
        if resolved_key:
            tasks = task_service.createTaskQuery().processInstanceId(instance_id).taskDefinitionKey(resolved_key).list()
            assert int(tasks.size()) > 0, (
                f"No active task with key or name '{name}' for instance '{instance_id}'"
            )
        else:
            count = int(task_service.createTaskQuery().processInstanceId(instance_id).count())
            assert count > 0, f"No active tasks found for instance '{instance_id}'"

    @keyword
    @except_interop_exception
    @with_authenticated_user
    def complete_task(self, name: str = "", process_instance_id: str = "", user_id: str = "", **variables: Any):
        """Completes the active user task for the process instance.

        Uses the current instance in scope (set by ``Start Instance``) unless
        ``process_instance_id`` is provided explicitly.
        The task may be identified by its definition key *or* by its human-readable name.
        When *name* is omitted (and only one task is active), that task is completed.

        If user_id is provided, it is set as the authenticated user before the task
        is completed.
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        resolved_key = self._resolve_task_key(instance_id, name)
        task_service = self.engine.getTaskService()
        query = task_service.createTaskQuery().processInstanceId(instance_id)
        if resolved_key:
            query = query.taskDefinitionKey(resolved_key)
        task = query.singleResult()
        assert task, f"No task found for instance {instance_id}"
        if variables:
            var_map = Variables.createVariables()
            for var_name, value in variables.items():
                var_map.putValue(var_name, value)
            task_service.complete(task.getId(), var_map)
        else:
            task_service.complete(task.getId())

    @keyword
    @except_interop_exception
    def get_process_variable(self, variable_name: str, process_instance_id: str = "") -> Any:
        """Returns the value of a process variable.

        Defaults to the current instance in scope; pass ``process_instance_id`` to override.
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        runtime = self.engine.getRuntimeService()
        return runtime.getVariable(instance_id, variable_name)

    @keyword
    @except_interop_exception
    def set_process_variable(self, variable_name: str, variable_value: Any = None, process_instance_id: str = ""):
        """Sets a process variable.

        Defaults to the current instance in scope; pass ``process_instance_id`` to override.
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        runtime = self.engine.getRuntimeService()
        runtime.setVariable(instance_id, variable_name, variable_value)

    @keyword
    @except_interop_exception
    def set_date_process_variable(self,
                                  variable_name: str,
                                  variable_value: Any,
                                  pattern: str = "yyyy-MM-dd'T'HH:mm:ssX",
                                  process_instance_id: str = ""):
        """Parses variable_value as Java Date and sets it as a process variable.

        This is needed when a real java.util.Date value is required.
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        SimpleDateFormat = java.type("java.text.SimpleDateFormat")
        sdf = SimpleDateFormat(pattern)
        parsed_date = sdf.parse(str(variable_value))
        runtime = self.engine.getRuntimeService()
        runtime.setVariable(instance_id, variable_name, parsed_date)

    @keyword
    @except_interop_exception
    def get_tasks(self, process_instance_id: str = "") -> list:
        """Returns all active tasks for the process instance as a list of dicts.

        Each dict has: id, name, taskDefinitionKey, assignee.
        Defaults to the current instance in scope; pass ``process_instance_id`` to override.
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        task_service = self.engine.getTaskService()
        tasks = task_service.createTaskQuery().processInstanceId(instance_id).list()
        result = []
        for i in range(int(tasks.size())):
            task = tasks.get(i)
            result.append({
                "id": str(task.getId()),
                "name": str(task.getName()) if task.getName() else None,
                "taskDefinitionKey": str(task.getTaskDefinitionKey()),
                "assignee": str(task.getAssignee()) if task.getAssignee() else None,
            })
        return result

    @keyword
    @except_interop_exception
    @with_authenticated_user
    def start_instance_with_variables(self, process_definition_key: str, business_key: str = "", user_id: str = "", **variables: Any) -> str:
        """Starts a process instance with the given variables and stores it as the current instance.

        If *business_key* is not provided, a UUID4 is generated automatically.
        """
        assert self.engine, "No engine"
        if not business_key:
            business_key = str(uuid.uuid4())
        runtime = self.engine.getRuntimeService()
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            instance = runtime.startProcessInstanceByKey(process_definition_key, business_key, var_map)
        else:
            instance = runtime.startProcessInstanceByKey(process_definition_key, business_key)
        assertThat(instance).isStarted()
        self._current_instance_id = str(instance.getId())
        self._current_business_key = business_key
        return self._current_instance_id
    
    @keyword
    @except_interop_exception
    @with_authenticated_user
    def start_instance_before_activity(self, process_definition_key: str, activity_id: str, business_key: str = "", user_id: str = "", **variables: Any) -> str:
        """Starts a process instance and places the token immediately before *activity_id*.

        Behaves like Start Instance With Variables but positions the token before the
        requested activity. Returns the started process instance id and stores it as
        the current instance in scope.
        """
        assert self.engine, "No engine"
        if not business_key:
            business_key = str(uuid.uuid4())
        runtime = self.engine.getRuntimeService()
        builder = runtime.createProcessInstanceByKey(process_definition_key).businessKey(business_key)
        if variables:
            var_map = Variables.createVariables()
            for name, value in variables.items():
                var_map.putValue(name, value)
            builder = builder.setVariables(var_map)

        resolved_activity_id = self._resolve_activity_id(process_definition_key, activity_id)
        started = builder.startBeforeActivity(resolved_activity_id).execute()
        assert started is not None, (
            f"Engine returned no instance for activity '{resolved_activity_id}' "
            f"in process '{process_definition_key}'"
        )
        instance_id = str(started.getId())

        self._current_instance_id = instance_id
        self._current_business_key = business_key
        return self._current_instance_id
    
    @keyword
    @except_interop_exception
    def move_instance_to(self, activity_id: str, process_instance_id: str = ""):
        """Moves the execution of the process instance to the given activity.

        Example usage:

        | ${instance}=    Start Instance    my-process
        | Move Instance To    Activity_10   ${instance}
        | Should Have Task    Review Order    ${instance}
        """
        instance_id = self._resolve_instance_id(process_instance_id)
        runtime = self.engine.getRuntimeService()

        # Find active executions with an activity id
        executions = runtime.createExecutionQuery().processInstanceId(instance_id).list()
        active_activities = []
        for i in range(int(executions.size())):
            exe = executions.get(i)
            try:
                aid = exe.getActivityId()
            except Exception:
                aid = None
            if aid:
                active_activities.append(str(aid))

        if len(active_activities) != 1:
            raise AssertionError(
                "move_instance_to requires exactly one active token at a single activity. "
                f"Found {len(active_activities)} active activities: {active_activities}"
            )

        current_activity = active_activities[0]

        modification = runtime.createProcessInstanceModification(instance_id)
        modification.startBeforeActivity(activity_id)
        # Cancel all active executions at the current activity to avoid parallel tokens after the move.
        modification.cancelAllForActivity(current_activity)
        modification.execute()

    @keyword
    @except_interop_exception
    def get_active_activities(self, process_instance_id: str = "") -> list:
        """Returns the IDs of all currently active (unfinished) activities.

        Useful for diagnosing where the token is when a test gets stuck.

        Example::

            ${activities}=    Get Active Activities
            Log    ${activities}
        """
        assert self.engine, "No engine"
        instance_id = self._resolve_instance_id(process_instance_id)
        history = self.engine.getHistoryService()
        items = (history.createHistoricActivityInstanceQuery()
                 .processInstanceId(instance_id)
                 .unfinished()
                 .list())
        result = []
        for i in range(int(items.size())):
            item = items.get(i)
            result.append({
                "activityId": str(item.getActivityId()),
                "activityName": str(item.getActivityName()) if item.getActivityName() else None,
                "activityType": str(item.getActivityType()) if item.getActivityType() else None,
            })
        return result

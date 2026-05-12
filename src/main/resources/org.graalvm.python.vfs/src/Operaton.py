from robot.api.deco import keyword
from pathlib import Path
from typing import Any

import os

from robotlibcore import DynamicCore

from keywords.base import Variables, except_interop_exception
from keywords.process_assertions import ProcessAssertions
from keywords.event_keywords import EventKeywords
from keywords.history_keywords import HistoryKeywords
from keywords.dmn_keywords import DmnKeywords
from keywords.typed_variables import TypedVariables
from keywords.timer_keywords import TimerKeywords
from keywords.external_task_keywords import ExternalTaskKeywords
from keywords.bpmn_keywords import BpmnKeywords

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


class Operaton(DynamicCore):
    ROBOT_LIBRARY_SCOPE = "GLOBAL"

    engine: Any = None

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
        ]
        DynamicCore.__init__(self, components)

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

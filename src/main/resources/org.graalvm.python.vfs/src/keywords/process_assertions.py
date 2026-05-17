from robot.api.deco import keyword
from typing import Any

from keywords.base import except_interop_exception


class ProcessAssertions:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def should_be_ended(self, process_instance_id: str = ""):
        """Asserts that the process instance has ended. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        history = self.ctx.engine.getHistoryService()
        instance = history.createHistoricProcessInstanceQuery() \
            .processInstanceId(instance_id).singleResult()
        assert instance is not None, (
            f"Process instance '{instance_id}' not found in history"
        )
        assert instance.getEndTime() is not None, (
            f"Process instance '{instance_id}' has not ended"
        )

    @keyword
    @except_interop_exception
    def should_be_active(self, process_instance_id: str = ""):
        """Asserts that the process instance is currently active. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        instance = runtime.createProcessInstanceQuery() \
            .processInstanceId(instance_id).singleResult()
        assert instance is not None, (
            f"Process instance '{instance_id}' not found or has ended"
        )
        assert not instance.isSuspended(), (
            f"Process instance '{instance_id}' is suspended, not active"
        )

    @keyword
    @except_interop_exception
    def should_be_suspended(self, process_instance_id: str = ""):
        """Asserts that the process instance is suspended. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        instance = runtime.createProcessInstanceQuery() \
            .processInstanceId(instance_id).singleResult()
        assert instance is not None, (
            f"Process instance '{instance_id}' not found or has ended"
        )
        assert instance.isSuspended(), (
            f"Process instance '{instance_id}' is not suspended"
        )

    @keyword
    @except_interop_exception
    def suspend_instance(self, process_instance_id: str = ""):
        """Suspends a running process instance. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        runtime.suspendProcessInstanceById(instance_id)

    @keyword
    @except_interop_exception
    def activate_instance(self, process_instance_id: str = ""):
        """Activates a suspended process instance. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        runtime.activateProcessInstanceById(instance_id)

    @keyword
    @except_interop_exception
    def should_have_n_active_tasks(self, expected_count: Any = 0, process_instance_id: str = ""):
        """Asserts that the process instance has exactly N active tasks. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        task_service = self.ctx.engine.getTaskService()
        tasks = task_service.createTaskQuery() \
            .processInstanceId(instance_id).list()
        actual = int(tasks.size())
        expected = int(expected_count)
        assert actual == expected, (
            f"Expected {expected} active tasks, but found {actual}"
        )

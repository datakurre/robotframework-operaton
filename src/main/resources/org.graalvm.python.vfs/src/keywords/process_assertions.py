from robot.api.deco import keyword
from typing import Any

from keywords.base import except_interop_exception


class ProcessAssertions:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def should_be_ended(self):
        """Asserts that the current process instance has ended."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
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
    def should_be_active(self):
        """Asserts that the current process instance is active."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
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
    def should_be_suspended(self):
        """Asserts that the current process instance is suspended."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
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
    def suspend_instance(self):
        """Suspends the current process instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
        runtime = self.ctx.engine.getRuntimeService()
        runtime.suspendProcessInstanceById(instance_id)

    @keyword
    @except_interop_exception
    def activate_instance(self):
        """Activates the suspended current process instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
        runtime = self.ctx.engine.getRuntimeService()
        runtime.activateProcessInstanceById(instance_id)

    @keyword
    @except_interop_exception
    def should_have_n_active_tasks(self, expected_count: Any = 0):
        """Asserts that the current process instance has exactly N active tasks."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id()
        task_service = self.ctx.engine.getTaskService()
        tasks = task_service.createTaskQuery() \
            .processInstanceId(instance_id).list()
        actual = int(tasks.size())
        expected = int(expected_count)
        assert actual == expected, (
            f"Expected {expected} active tasks, but found {actual}"
        )

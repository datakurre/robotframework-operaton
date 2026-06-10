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
        instance = (
            history.createHistoricProcessInstanceQuery()
            .processInstanceId(instance_id)
            .singleResult()
        )
        assert (
            instance is not None
        ), f"Process instance '{instance_id}' not found in history"
        assert (
            instance.getEndTime() is not None
        ), f"Process instance '{instance_id}' has not ended"

    @keyword
    @except_interop_exception
    def should_be_active(self, process_instance_id: str = ""):
        """Asserts that the process instance is currently active. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        instance = (
            runtime.createProcessInstanceQuery()
            .processInstanceId(instance_id)
            .singleResult()
        )
        assert (
            instance is not None
        ), f"Process instance '{instance_id}' not found or has ended"
        assert (
            not instance.isSuspended()
        ), f"Process instance '{instance_id}' is suspended, not active"

    @keyword
    @except_interop_exception
    def should_be_suspended(self, process_instance_id: str = ""):
        """Asserts that the process instance is suspended. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        instance = (
            runtime.createProcessInstanceQuery()
            .processInstanceId(instance_id)
            .singleResult()
        )
        assert (
            instance is not None
        ), f"Process instance '{instance_id}' not found or has ended"
        assert (
            instance.isSuspended()
        ), f"Process instance '{instance_id}' is not suspended"

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
    def should_have_active(
        self,
        activity_id: str = "",
        name: str = "",
        times: int = 1,
        process_instance_id: str = "",
    ):
        """Asserts that the process instance has exactly *times* currently active (unfinished) activity instances.

        Filter by *activity_id* (BPMN element ID) or *name* (human-readable element name).
        Omit both to count all currently active activities. *times* defaults to 1.
        Defaults to the current instance in scope.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        history = self.ctx.engine.getHistoryService()
        query = (
            history.createHistoricActivityInstanceQuery()
            .processInstanceId(instance_id)
            .unfinished()
        )
        if activity_id:
            query = query.activityId(activity_id)
        if name:
            query = query.activityName(name)
        actual = int(query.count())
        assert actual == int(times), (
            f"Expected {int(times)} active activity instance(s)"
            + (f" for activity '{activity_id or name}'" if activity_id or name else "")
            + f", but found {actual}"
        )

    @keyword
    @except_interop_exception
    def should_have_completed(
        self,
        activity_id: str = "",
        name: str = "",
        times: int = 1,
        process_instance_id: str = "",
    ):
        """Asserts that the process instance has exactly *times* completed activity instances.

        Filter by *activity_id* (BPMN element ID) or *name* (human-readable element name).
        Omit both to count all completed activities. *times* defaults to 1.
        Defaults to the current instance in scope.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        history = self.ctx.engine.getHistoryService()
        query = (
            history.createHistoricActivityInstanceQuery()
            .processInstanceId(instance_id)
            .finished()
        )
        if activity_id:
            query = query.activityId(activity_id)
        if name:
            query = query.activityName(name)
        actual = int(query.count())
        assert actual == int(times), (
            f"Expected {int(times)} completed activity instance(s)"
            + (f" for activity '{activity_id or name}'" if activity_id or name else "")
            + f", but found {actual}"
        )

from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class ProcessAssertions:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def should_be_ended(self, process_instance_id: str = "") -> None:
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
    def should_be_active(self, process_instance_id: str = "") -> None:
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
    def should_be_suspended(self, process_instance_id: str = "") -> None:
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
    def suspend_instance(self, process_instance_id: str = "") -> None:
        """Suspends a running process instance. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        runtime.suspendProcessInstanceById(instance_id)

    @keyword
    @except_interop_exception
    def activate_instance(self, process_instance_id: str = "") -> None:
        """Activates a suspended process instance. Defaults to the current instance."""
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()
        runtime.activateProcessInstanceById(instance_id)

    @keyword
    @except_interop_exception
    def stop_instance(self, process_instance_id: str = "") -> None:
        """Stops (terminates) a process instance while preserving its history. Defaults to the current instance.

        The instance is removed from active execution but remains in the history for auditing
        and test coverage tracking. The current instance state is preserved, so subsequent
        keywords can still reference the stopped instance for queries and assertions.

        By default, execution listeners and I/O variable mappings are skipped during deletion
        to avoid side effects.

        If the instance is already stopped, this keyword does nothing.
        """
        assert self.ctx.engine, "No engine"
        instance_id = self.ctx._resolve_instance_id(process_instance_id)
        runtime = self.ctx.engine.getRuntimeService()

        # Check if instance is still active
        instance = (
            runtime.createProcessInstanceQuery()
            .processInstanceId(instance_id)
            .singleResult()
        )

        # Only delete if the instance is still active
        if instance is not None:
            runtime.deleteProcessInstance(
                instance_id,
                "Stopped via Stop Instance keyword",
                True,  # skipCustomListeners
                True,  # externallyTerminated
                True,  # skipIoMappings
                False,  # skipSubprocesses
            )

    @keyword
    @except_interop_exception
    def should_have_active(
        self,
        activity_id: str = "",
        name: str = "",
        times: int = 1,
        process_instance_id: str = "",
    ) -> None:
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
    ) -> None:
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

    @keyword
    @except_interop_exception
    def log_engine_diagnostics(
        self,
        process_instance_id: str = "",
        max_items: int = 25,
        verbose: bool = False,
    ) -> str:
        """Logs and returns an actionable diagnostics snapshot of engine state.

        Designed to pinpoint leftovers from previous tests and identify why a
        job-driving keyword progresses unexpectedly.

        - Always shows orphaned jobs/subscriptions/external tasks.
        - When ``process_instance_id`` is given, compares scoped vs non-scoped
          timer jobs (a common source of cross-test interference).
        - Set ``verbose`` to include active instances and non-orphan details.

        Example usage in Robot::

            Log Engine Diagnostics
            Log Engine Diagnostics    ${instance_id}
            Log Engine Diagnostics    ${instance_id}    max_items=100    verbose=${True}
        """
        from robot.api import logger

        assert self.ctx.engine, "No engine"
        runtime = self.ctx.engine.getRuntimeService()
        management = self.ctx.engine.getManagementService()
        external_task_service = self.ctx.engine.getExternalTaskService()

        active_instances = runtime.createProcessInstanceQuery().list()
        active_ids: set[str] = set()
        active_descriptions: list[str] = []
        for i in range(int(active_instances.size())):
            instance = active_instances.get(i)
            instance_id = str(instance.getId())
            active_ids.add(instance_id)
            active_descriptions.append(
                f"id={instance_id} definition={instance.getProcessDefinitionId()} businessKey={instance.getBusinessKey()}"
            )

        jobs = management.createJobQuery().list()
        timer_jobs = management.createJobQuery().timers().list()
        event_subscriptions = runtime.createEventSubscriptionQuery().list()
        external_tasks = external_task_service.createExternalTaskQuery().list()

        timer_job_ids: set[str] = set()
        for i in range(int(timer_jobs.size())):
            timer_job_ids.add(str(timer_jobs.get(i).getId()))

        orphan_job_lines: list[str] = []
        scoped_job_lines: list[str] = []
        non_scoped_timer_lines: list[str] = []
        for i in range(int(jobs.size())):
            job = jobs.get(i)
            job_id = str(job.getId())
            pid = str(job.getProcessInstanceId())
            is_timer = job_id in timer_job_ids
            due = str(job.getDuedate())
            retries = str(job.getRetries())
            exception = str(job.getExceptionMessage())
            base = (
                f"id={job_id} pid={pid} timer={is_timer} due={due} retries={retries}"
                f" exception={exception}"
            )
            if pid and pid not in active_ids:
                orphan_job_lines.append(base)
            if process_instance_id and pid == str(process_instance_id):
                scoped_job_lines.append(base)
            if process_instance_id and is_timer and pid != str(process_instance_id):
                non_scoped_timer_lines.append(base)

        orphan_subscription_lines: list[str] = []
        scoped_subscription_lines: list[str] = []
        for i in range(int(event_subscriptions.size())):
            sub = event_subscriptions.get(i)
            pid = str(sub.getProcessInstanceId())
            line = (
                f"type={sub.getEventType()} name={sub.getEventName()}"
                f" pid={pid} activity={sub.getActivityId()}"
            )
            if pid and pid not in active_ids:
                orphan_subscription_lines.append(line)
            if process_instance_id and pid == str(process_instance_id):
                scoped_subscription_lines.append(line)

        orphan_external_lines: list[str] = []
        scoped_external_lines: list[str] = []
        for i in range(int(external_tasks.size())):
            task = external_tasks.get(i)
            pid = str(task.getProcessInstanceId())
            line = (
                f"id={task.getId()} topic={task.getTopicName()} pid={pid}"
                f" lockExpiration={task.getLockExpirationTime()}"
            )
            if pid and pid not in active_ids:
                orphan_external_lines.append(line)
            if process_instance_id and pid == str(process_instance_id):
                scoped_external_lines.append(line)

        limit = max(1, int(max_items))
        lines: list[str] = []
        lines.append("=== ENGINE DIAGNOSTICS ===")
        lines.append(f"active_process_instances={len(active_ids)}")
        lines.append(
            f"total_jobs={int(jobs.size())} total_timer_jobs={int(timer_jobs.size())}"
        )
        lines.append(f"total_event_subscriptions={int(event_subscriptions.size())}")
        lines.append(f"total_external_tasks={int(external_tasks.size())}")

        if process_instance_id:
            lines.append(f"scope_process_instance_id={process_instance_id}")
            lines.append(f"scope_jobs={len(scoped_job_lines)}")
            lines.append(f"scope_event_subscriptions={len(scoped_subscription_lines)}")
            lines.append(f"scope_external_tasks={len(scoped_external_lines)}")
            lines.append("non_scope_timer_jobs=" f"{len(non_scoped_timer_lines)}")

        lines.append(f"orphan_jobs={len(orphan_job_lines)}")
        lines.append(f"orphan_event_subscriptions={len(orphan_subscription_lines)}")
        lines.append(f"orphan_external_tasks={len(orphan_external_lines)}")

        if verbose:
            lines.append("--- ACTIVE INSTANCES ---")
            if active_descriptions:
                lines.extend(active_descriptions[:limit])
            else:
                lines.append("none")

        if process_instance_id:
            lines.append("--- SCOPED JOBS ---")
            if scoped_job_lines:
                lines.extend(scoped_job_lines[:limit])
            else:
                lines.append("none")

        if process_instance_id:
            lines.append("--- NON-SCOPE TIMER JOBS (HIGH RISK) ---")
            if non_scoped_timer_lines:
                lines.extend(non_scoped_timer_lines[:limit])
            else:
                lines.append("none")

        lines.append("--- ORPHAN JOBS ---")
        if orphan_job_lines:
            lines.extend(orphan_job_lines[:limit])
        else:
            lines.append("none")

        lines.append("--- ORPHAN EVENT SUBSCRIPTIONS ---")
        if orphan_subscription_lines:
            lines.extend(orphan_subscription_lines[:limit])
        else:
            lines.append("none")

        lines.append("--- ORPHAN EXTERNAL TASKS ---")
        if orphan_external_lines:
            lines.extend(orphan_external_lines[:limit])
        else:
            lines.append("none")

        if verbose and process_instance_id:
            lines.append("--- SCOPED EVENT SUBSCRIPTIONS ---")
            if scoped_subscription_lines:
                lines.extend(scoped_subscription_lines[:limit])
            else:
                lines.append("none")

            lines.append("--- SCOPED EXTERNAL TASKS ---")
            if scoped_external_lines:
                lines.extend(scoped_external_lines[:limit])
            else:
                lines.append("none")

        message = "\n".join(lines)
        logger.warn(message)
        return message

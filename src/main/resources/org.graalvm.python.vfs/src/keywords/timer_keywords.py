from robot.api.deco import keyword
from typing import TYPE_CHECKING, Callable

from keywords.base import Variables, VariableValue, java, except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class TimerKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    def _normalize_wait_for(self, wait_for: str) -> str:
        return str(wait_for).strip().lower().replace("-", "_").replace(" ", "_")

    def _require_process_instance_id(self, process_instance_id: str) -> str:
        assert self.ctx.engine, "No engine"
        effective_id = process_instance_id or self.ctx._current_instance_id
        assert (
            effective_id
        ), "No process instance id provided and no current instance in scope"
        return str(effective_id)

    def _has_external_task(self, topic: str, process_instance_id: str = "") -> bool:
        """Check if an external task exists for the given topic without locking it."""
        assert self.ctx.engine, "No engine"
        external_task_service = self.ctx.engine.getExternalTaskService()
        query = external_task_service.createExternalTaskQuery().topicName(topic)
        effective_id = process_instance_id or self.ctx._current_instance_id
        if effective_id:
            query = query.processInstanceId(effective_id)
        return int(query.count()) > 0

    def _has_user_task(
        self, process_instance_id: str = "", task_name: str = ""
    ) -> bool:
        assert self.ctx.engine, "No engine"
        task_service = self.ctx.engine.getTaskService()
        query = task_service.createTaskQuery()
        if process_instance_id:
            query = query.processInstanceId(process_instance_id)
        if task_name:
            query = query.taskName(task_name)
        return int(query.count()) > 0

    def _has_event_subscription(
        self,
        event_type: str,
        process_instance_id: str = "",
        event_name: str = "",
    ) -> bool:
        assert self.ctx.engine, "No engine"
        runtime = self.ctx.engine.getRuntimeService()
        query = runtime.createEventSubscriptionQuery().eventType(str(event_type))
        if process_instance_id:
            query = query.processInstanceId(process_instance_id)
        if event_name:
            query = query.eventName(event_name)
        return int(query.count()) > 0

    def _has_timer_job(self, process_instance_id: str = "") -> bool:
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        query = management.createJobQuery().timers()
        if process_instance_id:
            query = query.processInstanceId(process_instance_id)
        return int(query.count()) > 0

    def _has_wait_state(
        self,
        wait_for: str,
        process_instance_id: str,
        topic: str = "",
        task_name: str = "",
        event_name: str = "",
    ) -> bool:
        normalized = self._normalize_wait_for(wait_for)

        checks: dict[str, Callable[[], bool]] = {
            "external_task": lambda: self._has_external_task(
                topic, process_instance_id
            ),
            "user_task": lambda: self._has_user_task(process_instance_id, task_name),
            "message_subscription": lambda: self._has_event_subscription(
                "message", process_instance_id, event_name
            ),
            "signal_subscription": lambda: self._has_event_subscription(
                "signal", process_instance_id, event_name
            ),
            "conditional_subscription": lambda: self._has_event_subscription(
                "conditional", process_instance_id, event_name
            ),
            "timer_job": lambda: self._has_timer_job(process_instance_id),
        }

        if normalized == "any":
            non_timer_wait_states = (
                "external_task",
                "user_task",
                "message_subscription",
                "signal_subscription",
                "conditional_subscription",
            )
            return any(checks[name]() for name in non_timer_wait_states)

        try:
            return checks[normalized]()
        except KeyError:
            supported = ", ".join(["any", *checks.keys()])
            raise AssertionError(
                f"Unsupported wait_for value '{wait_for}'. Supported values: {supported}"
            )

    def _get_executable_job_ids(self, process_instance_id: str = "") -> list[str]:
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        query = management.createJobQuery().executable()
        if process_instance_id:
            query = query.processInstanceId(process_instance_id)

        jobs = query.listPage(0, 50)
        return [str(jobs.get(i).getId()) for i in range(int(jobs.size()))]

    def _get_ordered_executable_job_ids(
        self, process_instance_id: str = ""
    ) -> list[str]:
        job_ids = self._get_executable_job_ids(process_instance_id)
        timer_ids = self._get_timer_job_ids(process_instance_id)

        non_timers = [job_id for job_id in job_ids if job_id not in timer_ids]
        timers = [job_id for job_id in job_ids if job_id in timer_ids]
        return non_timers + timers

    def _get_timer_job_ids(self, process_instance_id: str = "") -> set[str]:
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        query = management.createJobQuery().timers()
        if process_instance_id:
            query = query.processInstanceId(process_instance_id)

        timers = query.list()
        return {str(timers.get(i).getId()) for i in range(int(timers.size()))}

    def _select_next_non_timer_job_id(self, process_instance_id: str) -> str:
        job_ids = self._get_executable_job_ids(process_instance_id)
        timer_ids = self._get_timer_job_ids(process_instance_id)

        for job_id in job_ids:
            if job_id not in timer_ids:
                return job_id

        return ""

    def _execute_job(self, job_id: str) -> None:
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        management.executeJob(job_id)

    @keyword
    @except_interop_exception
    def set_clock(
        self, date_string: str, pattern: str = "yyyy-MM-dd'T'HH:mm:ss"
    ) -> None:
        """Sets the process engine clock to a specific date/time.

        Example usage in Robot::

            Set Clock    2025-06-15T10:00:00
        """
        ClockUtil = java.type("org.operaton.bpm.engine.impl.util.ClockUtil")
        SimpleDateFormat = java.type("java.text.SimpleDateFormat")
        sdf = SimpleDateFormat(pattern)
        date = sdf.parse(date_string)
        ClockUtil.setCurrentTime(date)

    @keyword
    @except_interop_exception
    def advance_clock(self, milliseconds: str | int) -> None:
        """Advances the process engine clock by the given number of milliseconds.

        Example usage in Robot::

            Advance Clock    3600000
        """
        ClockUtil = java.type("org.operaton.bpm.engine.impl.util.ClockUtil")
        Calendar = java.type("java.util.Calendar")
        current = ClockUtil.getCurrentTime()
        cal = Calendar.getInstance()
        cal.setTime(current)
        cal.add(Calendar.MILLISECOND, int(str(milliseconds)))
        ClockUtil.setCurrentTime(cal.getTime())

    @keyword
    @except_interop_exception
    def reset_clock(self) -> None:
        """Resets the process engine clock to the current system time.

        Example usage in Robot::

            Reset Clock
        """
        ClockUtil = java.type("org.operaton.bpm.engine.impl.util.ClockUtil")
        ClockUtil.reset()

    @keyword
    @except_interop_exception
    def execute_timer_jobs(self, process_instance_id: str = "") -> None:
        """Executes all timer jobs for the process instance.

        Defaults to the current instance in scope if one exists;
        if no current instance is set, executes all timer jobs across all instances.
        Pass ``process_instance_id`` to target a specific instance explicitly.

        Example usage in Robot::

            Execute Timer Jobs
            Execute Timer Jobs    ${instance_id}
        """
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        effective_id = process_instance_id or self.ctx._current_instance_id
        while True:
            query = management.createJobQuery().timers()
            if effective_id:
                query = query.processInstanceId(effective_id)
            jobs = query.listPage(0, 1)
            if int(jobs.size()) == 0:
                break
            # Executing one timer can cancel sibling timers on the same activity,
            # so refetch before each execution instead of iterating a stale list.
            job = jobs.get(0)
            management.executeJob(str(job.getId()))

    @keyword
    @except_interop_exception
    def execute_jobs(
        self,
        process_instance_id: str = "",
        max_jobs: int = 0,
    ) -> int:
        """Executes all pending jobs (async continuations, messages, timers) for the instance.

         Useful for advancing past async intermediate events
        (e.g. a mail-send throw event with asyncBefore=true).

        Returns the number of jobs executed.
        Set ``max_jobs`` to execute only the first N jobs from the pending batch.
        ``max_jobs=0`` (default) means no limit.

        Example usage in Robot::

            Execute Jobs
            Execute Jobs    max_jobs=1
        """
        assert self.ctx.engine, "No engine"

        effective_id = process_instance_id or self.ctx._current_instance_id or ""
        ordered_job_ids = self._get_ordered_executable_job_ids(str(effective_id))

        limit = (
            len(ordered_job_ids)
            if int(max_jobs) <= 0
            else min(len(ordered_job_ids), int(max_jobs))
        )

        for i in range(limit):
            self._execute_job(ordered_job_ids[i])

        return limit

    @keyword
    @except_interop_exception
    def execute_jobs_until_wait_state(
        self,
        wait_for: str = "any",
        process_instance_id: str = "",
        max_rounds: int = 20,
        topic: str = "",
        task_name: str = "",
        event_name: str = "",
    ) -> None:
        """Executes non-timer jobs one at a time until a selected wait state appears.

        Refetches jobs after each execution so jobs created by previous executions
        are also handled.

        Supported values for ``wait_for`` are:
        ``any``, ``external_task``, ``user_task``, ``message_subscription``,
        ``signal_subscription``, ``conditional_subscription``, ``timer_job``.

        Optional filters:
        - ``topic`` is used with ``external_task``.
        - ``task_name`` is used with ``user_task``.
        - ``event_name`` is used with ``message/signal/conditional_subscription``.
        """
        effective_id = self._require_process_instance_id(process_instance_id)

        for _ in range(int(max_rounds)):
            if self._has_wait_state(
                wait_for,
                effective_id,
                topic=str(topic),
                task_name=str(task_name),
                event_name=str(event_name),
            ):
                return

            next_job_id = self._select_next_non_timer_job_id(effective_id)
            if not next_job_id:
                return

            self._execute_job(next_job_id)

    @keyword
    @except_interop_exception
    def execute_timer_job(self, job_id: str, process_instance_id: str = "") -> None:
        """Executes a single timer job by its internal Operaton job ID (a UUID-like string).

        This is the engine-assigned job ID, not the BPMN element ID. To find jobs by
        their BPMN activity/element ID (e.g. ``Event_0lg2rf8``), use
        ``Execute Timer Job By Activity`` instead.

        Optionally specify a process instance to verify the job belongs to that instance.

        Raises an assertion error if the job is not found.

        Example usage in Robot::

            Execute Timer Job    ${job_id}
            Execute Timer Job    ${job_id}    ${instance_id}
        """
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()

        query = management.createJobQuery().jobId(str(job_id))
        if process_instance_id:
            query = query.processInstanceId(str(process_instance_id))

        job = query.singleResult()
        assert job is not None, f"No timer job found with ID '{job_id}'"

        self._execute_job(str(job.getId()))

    @keyword
    @except_interop_exception
    def execute_timer_job_by_activity(
        self, activity_id: str, process_instance_id: str = ""
    ) -> None:
        """Executes a single timer job by its BPMN activity/element ID.

        Use this when you know the BPMN element ID from the process model
        (e.g. ``Event_0lg2rf8``). The job is force-executed regardless of whether
        its due date has passed — no clock manipulation needed.

        Defaults to the current instance in scope if one exists;
        pass ``process_instance_id`` to target a specific instance explicitly.

        Raises an assertion error if no matching timer job is found.

        Example usage in Robot::

            Execute Timer Job By Activity    Event_0lg2rf8
            Execute Timer Job By Activity    Event_0lg2rf8    ${instance_id}
        """
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()

        query = management.createJobQuery().timers().activityId(str(activity_id))

        effective_id = process_instance_id or self.ctx._current_instance_id
        if effective_id:
            query = query.processInstanceId(str(effective_id))

        job = query.singleResult()
        assert job is not None, f"No timer job found with activity ID '{activity_id}'"

        self._execute_job(str(job.getId()))

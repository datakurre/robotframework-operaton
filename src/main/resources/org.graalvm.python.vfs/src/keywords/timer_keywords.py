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
            return any(check() for check in checks.values())

        try:
            return checks[normalized]()
        except KeyError:
            supported = ", ".join(["any", *checks.keys()])
            raise AssertionError(
                f"Unsupported wait_for value '{wait_for}'. Supported values: {supported}"
            )

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
    def execute_jobs(self, process_instance_id: str = "", max_jobs: int = 0) -> int:
        """Executes all pending jobs (async continuations, messages, timers) for the instance.

         Useful for advancing past async intermediate events
        (e.g. a mail-send throw event with asyncBefore=true).

        Returns the number of jobs executed.
        Set ``max_jobs`` to execute only the first N jobs from the pending batch.
        ``max_jobs=0`` (default) means no limit.

        Example usage in Robot::

            Execute Jobs
            Execute Jobs    ${instance_id}
        """
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        query = management.createJobQuery()
        effective_id = process_instance_id or self.ctx._current_instance_id
        if effective_id:
            query = query.processInstanceId(effective_id)
        jobs = query.list()
        count = int(jobs.size())
        limit = count if int(max_jobs) <= 0 else min(count, int(max_jobs))
        for i in range(limit):
            job = jobs.get(i)
            management.executeJob(str(job.getId()))
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
        """Executes jobs one at a time until a selected wait state appears.

        Refetches jobs after each execution so jobs created by previous executions
        are also handled.

        Supported values for ``wait_for`` are:
        ``any``, ``external_task``, ``user_task``, ``message_subscription``,
        ``signal_subscription``, ``conditional_subscription``, ``timer_job``.

        Optional filters:
        - ``topic`` is used with ``external_task``.
        - ``task_name`` is used with ``user_task``.
        - ``event_name`` is used with ``message/signal/conditional_subscription``.

        Example usage in Robot::

            Execute Jobs Until Wait State    user_task
            Execute Jobs Until Wait State    external_task    topic=mail-send
            Execute Jobs Until Wait State    any    max_rounds=50
        """
        assert self.ctx.engine, "No engine"
        effective_id = process_instance_id or self.ctx._current_instance_id
        assert (
            effective_id
        ), "No process instance id provided and no current instance in scope"

        rounds = int(max_rounds)
        for _ in range(rounds):
            if self._has_wait_state(
                wait_for,
                str(effective_id),
                topic=str(topic),
                task_name=str(task_name),
                event_name=str(event_name),
            ):
                break

            management = self.ctx.engine.getManagementService()
            query = (
                management.createJobQuery()
                .executable()
                .processInstanceId(str(effective_id))
            )
            jobs = query.listPage(0, 1)
            if int(jobs.size()) == 0:
                break
            job = jobs.get(0)
            management.executeJob(str(job.getId()))

    @keyword
    @except_interop_exception
    def complete_external_task_and_execute_jobs(
        self,
        topic: str,
        process_instance_id: str = "",
        worker_id: str = "robot-worker",
        execute_jobs_before: bool = True,
        execute_jobs_after: bool = True,
        **variables: VariableValue,
    ) -> None:
        """Completes one external task for the given topic and executes pending jobs before and after."""
        assert self.ctx.engine, "No engine"

        instance_id = process_instance_id or self.ctx._current_instance_id
        assert (
            instance_id
        ), "No process instance id provided and no current instance in scope"

        # Complete async-before jobs etc.
        if execute_jobs_before:
            self.execute_jobs(instance_id)

        external_task_service = self.ctx.engine.getExternalTaskService()
        fetch_and_lock = external_task_service.fetchAndLock(1, worker_id).topic(
            topic, 1000
        )
        tasks = fetch_and_lock.execute()

        matching_task = None
        task_count = int(tasks.size())
        for i in range(task_count):
            task = tasks.get(i)
            if str(task.getProcessInstanceId()) == str(instance_id):
                matching_task = task
                break

        assert (
            matching_task
        ), f"No external task found for topic '{topic}' in process instance {instance_id}"

        if variables:
            var_map = Variables.createVariables()
            for var_name, value in variables.items():
                var_map.putValue(var_name, value)
            external_task_service.complete(matching_task.getId(), worker_id, var_map)
        else:
            external_task_service.complete(matching_task.getId(), worker_id)

        # Complete async-after jobs etc.
        if execute_jobs_after:
            self.execute_jobs(instance_id)

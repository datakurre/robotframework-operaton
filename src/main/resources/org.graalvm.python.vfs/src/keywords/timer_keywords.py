from robot.api.deco import keyword
from typing import TYPE_CHECKING

from keywords.base import Variables, VariableValue, java, except_interop_exception


if TYPE_CHECKING:
    from Operaton import Operaton


class TimerKeywords:
    def __init__(self, ctx: "Operaton") -> None:
        self.ctx = ctx

    def _has_external_task(self, topic: str, process_instance_id: str = "") -> bool:
        """Check if an external task exists for the given topic without locking it."""
        assert self.ctx.engine, "No engine"
        external_task_service = self.ctx.engine.getExternalTaskService()
        query = external_task_service.createExternalTaskQuery().topicName(topic)
        effective_id = process_instance_id or self.ctx._current_instance_id
        if effective_id:
            query = query.processInstanceId(effective_id)
        return int(query.count()) > 0

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
        query = management.createJobQuery().timers()
        effective_id = process_instance_id or self.ctx._current_instance_id
        if effective_id:
            query = query.processInstanceId(effective_id)
        jobs = query.list()
        for i in range(int(jobs.size())):
            job = jobs.get(i)
            management.executeJob(job.getId())

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
    def execute_jobs_until_external_task(
        self,
        topic: str,
        process_instance_id: str = "",
        max_rounds: int = 20,
    ) -> int:
        """Executes jobs one at a time until an external task for the given topic appears.

        Useful for processes with chained async continuations that create new jobs during execution.
        Refetches the pending job list after each execution, so newly created jobs are picked up.

        Returns the total number of jobs executed.
        Stops when an external task for the topic is found or ``max_rounds`` is reached.

        Example usage in Robot::

            Execute Jobs Until External Task    mail-send
            Execute Jobs Until External Task    mvre.rcvideo.transcription.create    max_rounds=5
        """
        assert self.ctx.engine, "No engine"
        effective_id = process_instance_id or self.ctx._current_instance_id
        assert (
            effective_id
        ), "No process instance id provided and no current instance in scope"

        total = 0
        for _ in range(max_rounds):
            # Check if external task already exists
            if self._has_external_task(topic, effective_id):
                break
            # Fetch fresh pending jobs
            management = self.ctx.engine.getManagementService()
            query = (
                management.createJobQuery().executable().processInstanceId(effective_id)
            )
            jobs = query.listPage(0, 1)
            if int(jobs.size()) == 0:
                # No more jobs and no external task yet
                break
            job = jobs.get(0)
            management.executeJob(str(job.getId()))
            total += 1
        return total

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

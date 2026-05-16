from robot.api.deco import keyword
from typing import Any

from keywords.base import java, except_interop_exception


class TimerKeywords:

    def __init__(self, ctx: Any):
        self.ctx = ctx

    @keyword
    @except_interop_exception
    def set_clock(self, date_string: str, pattern: str = "yyyy-MM-dd'T'HH:mm:ss"):
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
    def advance_clock(self, milliseconds: Any):
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
    def reset_clock(self):
        """Resets the process engine clock to the current system time.

        Example usage in Robot::

            Reset Clock
        """
        ClockUtil = java.type("org.operaton.bpm.engine.impl.util.ClockUtil")
        ClockUtil.reset()

    @keyword
    @except_interop_exception
    def execute_timer_jobs(self):
        """Executes all timer jobs for the current process instance.

        Uses the current instance in scope if one exists;
        if no current instance is set, executes all timer jobs across all instances.

        Example usage in Robot::

            Execute Timer Jobs
        """
        assert self.ctx.engine, "No engine"
        management = self.ctx.engine.getManagementService()
        query = management.createJobQuery().timers()
        effective_id = self.ctx._current_instance_id
        if effective_id:
            query = query.processInstanceId(effective_id)
        jobs = query.list()
        for i in range(int(jobs.size())):
            job = jobs.get(i)
            management.executeJob(job.getId())

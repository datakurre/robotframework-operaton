package fi.jyu.vasara;

import org.operaton.bpm.engine.delegate.DelegateTask;
import org.operaton.bpm.engine.delegate.TaskListener;

/**
 * Task listener that fires on assignment events. Sets a {@code taskAssignee} local variable on the
 * task so downstream mappings and expressions can reference it without additional identity lookups.
 */
public class VasaraUserTaskAssignmentListener implements TaskListener {

  @Override
  public void notify(DelegateTask delegateTask) {
    String assignee = delegateTask.getAssignee();
    delegateTask.setVariableLocal("taskAssignee", assignee != null ? assignee : "");
  }
}

package fi.jyu.vasara;

import org.operaton.bpm.engine.delegate.ExecutionListener;
import org.operaton.bpm.engine.delegate.TaskListener;
import org.operaton.bpm.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.operaton.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.operaton.bpm.engine.impl.pvm.process.ActivityImpl;
import org.operaton.bpm.engine.impl.pvm.process.ScopeImpl;
import org.operaton.bpm.engine.impl.task.TaskDefinition;
import org.operaton.bpm.engine.impl.util.xml.Element;

/**
 * BPMN parse listener that registers Vasara execution and task listeners on every start event and
 * user task in every deployed process.
 */
public class VasaraBpmnParseListener extends AbstractBpmnParseListener {

  private final VasaraStartEventExecutionListener startEventListener =
      new VasaraStartEventExecutionListener();
  private final VasaraUserTaskExecutionListener userTaskListener =
      new VasaraUserTaskExecutionListener();
  private final VasaraUserTaskAssignmentListener assignmentListener =
      new VasaraUserTaskAssignmentListener();

  @Override
  public void parseStartEvent(Element element, ScopeImpl scope, ActivityImpl activity) {
    activity.addListener(ExecutionListener.EVENTNAME_END, startEventListener);
  }

  @Override
  public void parseUserTask(Element element, ScopeImpl scope, ActivityImpl activity) {
    activity.addListener(ExecutionListener.EVENTNAME_END, userTaskListener);
    TaskDefinition taskDefinition =
        ((UserTaskActivityBehavior) activity.getActivityBehavior()).getTaskDefinition();
    taskDefinition.addTaskListener(TaskListener.EVENTNAME_ASSIGNMENT, assignmentListener);
  }
}

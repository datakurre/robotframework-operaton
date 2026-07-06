package fi.jyu.vasara.tools;

import java.util.logging.Logger;
import org.operaton.bpm.engine.delegate.DelegateExecution;
import org.operaton.bpm.engine.delegate.JavaDelegate;

/** Test-safe message delegate that intentionally performs no side effects. */
public class SendMessageDelegate implements JavaDelegate {

  private static final Logger LOGGER = Logger.getLogger(SendMessageDelegate.class.getName());

  @Override
  public void execute(DelegateExecution execution) {
    LOGGER.fine(
        () ->
            "Skipping message send in test delegate for processInstanceId="
                + execution.getProcessInstanceId());
  }
}

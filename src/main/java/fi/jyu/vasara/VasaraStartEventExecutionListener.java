package fi.jyu.vasara;

import java.util.List;
import org.operaton.bpm.engine.FormService;
import org.operaton.bpm.engine.ProcessEngine;
import org.operaton.bpm.engine.delegate.DelegateExecution;
import org.operaton.bpm.engine.delegate.ExecutionListener;
import org.operaton.bpm.engine.exception.NullValueException;
import org.operaton.bpm.engine.form.FormField;
import org.operaton.bpm.engine.form.FormType;
import org.operaton.bpm.engine.form.StartFormData;
import org.operaton.bpm.engine.impl.form.type.AbstractFormFieldType;
import org.operaton.bpm.engine.variable.value.TypedValue;

/**
 * Execution listener that fires on start event completion. Initializes any process variables
 * declared in the start form that have not yet been set. This ensures variables exist even when a
 * process was started programmatically without submitting a form.
 */
public class VasaraStartEventExecutionListener implements ExecutionListener {

  @Override
  public void notify(DelegateExecution execution) throws Exception {
    ProcessEngine processEngine = execution.getProcessEngine();
    FormService formService = processEngine.getFormService();
    StartFormData startFormData;
    try {
      startFormData = formService.getStartFormData(execution.getProcessDefinitionId());
    } catch (NullValueException e) {
      // Process has no start form handler (e.g. no start event form); skip
      return;
    }
    if (startFormData != null) {
      List<FormField> formFieldList = startFormData.getFormFields();
      for (FormField formField : formFieldList) {
        if (!execution.hasVariable(formField.getId())) {
          FormType formType = formField.getType();
          TypedValue value = formField.getValue();
          if (formType instanceof AbstractFormFieldType) {
            value = ((AbstractFormFieldType) formType).convertToModelValue(value);
          }
          execution.setVariable(formField.getId(), value);
        }
      }
    }
  }
}

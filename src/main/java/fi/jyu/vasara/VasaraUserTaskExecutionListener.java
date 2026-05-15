package fi.jyu.vasara;

import java.util.List;
import org.operaton.bpm.engine.FormService;
import org.operaton.bpm.engine.ProcessEngine;
import org.operaton.bpm.engine.TaskService;
import org.operaton.bpm.engine.delegate.DelegateExecution;
import org.operaton.bpm.engine.delegate.ExecutionListener;
import org.operaton.bpm.engine.form.FormData;
import org.operaton.bpm.engine.form.FormField;
import org.operaton.bpm.engine.form.FormType;
import org.operaton.bpm.engine.impl.form.type.AbstractFormFieldType;
import org.operaton.bpm.engine.task.Task;
import org.operaton.bpm.engine.task.TaskQuery;
import org.operaton.bpm.engine.variable.Variables;
import org.operaton.bpm.engine.variable.value.TypedValue;
import org.operaton.bpm.model.bpmn.BpmnModelException;
import org.operaton.bpm.model.bpmn.instance.operaton.OperatonInputOutput;

/**
 * Execution listener that fires when a user task completes. Initializes any task form field
 * variables that were not submitted, ensures string fields default to empty string instead of null,
 * and injects a {@code taskAssignee} local variable for tasks that have I/O mappings.
 */
public class VasaraUserTaskExecutionListener implements ExecutionListener {

  @Override
  public void notify(DelegateExecution execution) throws Exception {
    ProcessEngine processEngine = execution.getProcessEngine();
    TaskService taskService = processEngine.getTaskService();
    TaskQuery taskQuery = taskService.createTaskQuery();
    Task task = taskQuery.executionId(execution.getId()).singleResult();
    if (task != null) {
      FormService formService = processEngine.getFormService();
      FormData formData = formService.getTaskFormData(task.getId());
      if (formData != null) {
        List<FormField> formFieldList = formData.getFormFields();
        for (FormField formField : formFieldList) {
          if (!execution.hasVariable(formField.getId())) {
            FormType formType = formField.getType();
            TypedValue value = formField.getValue();
            if (formType instanceof AbstractFormFieldType) {
              value = ((AbstractFormFieldType) formType).convertToModelValue(value);
            }
            execution.setVariable(formField.getId(), value);
          }
          // Ensure string fields are empty strings, not nulls
          if (formField.getTypeName().equals("string")
              && execution.getVariableTyped(formField.getId()).getValue() == null) {
            execution.setVariable(formField.getId(), "");
          }
        }
      }
      // Set a convenient 'taskAssignee' local variable if the task has its own scope
      // (indicated by OperatonInputOutput I/O mappings on the task element)
      try {
        final OperatonInputOutput camundaInputOutput =
            execution
                .getBpmnModelElementInstance()
                .getExtensionElements()
                .getElementsQuery()
                .filterByType(OperatonInputOutput.class)
                .singleResult();
        if (camundaInputOutput != null
            && (camundaInputOutput.getOperatonInputParameters().size() > 0
                || camundaInputOutput.getOperatonOutputParameters().size() > 0)) {
          // Task with input or output mapping is guaranteed to have a scope of its own
          execution.setVariableLocal("taskAssignee", Variables.stringValue(task.getAssignee()));
        }
      } catch (BpmnModelException | NullPointerException e) {
        // ExtensionElements is null or does not contain OperatonInputOutput
      }
    }
  }
}

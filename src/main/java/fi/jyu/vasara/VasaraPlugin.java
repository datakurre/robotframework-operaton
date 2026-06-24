package fi.jyu.vasara;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.operaton.bpm.engine.ProcessEngine;
import org.operaton.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.operaton.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.operaton.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.operaton.bpm.engine.impl.form.type.AbstractFormFieldType;
import org.operaton.bpm.engine.impl.form.type.DateFormType;
import org.operaton.bpm.engine.impl.form.type.LongFormType;
import org.operaton.bpm.engine.impl.form.validator.FormFieldValidator;

/**
 * Process engine plugin that activates all Vasara form customizations:
 *
 * <ul>
 *   <li>Custom form field types: {@code json} (Spin-based), flexible {@code date}, numeric {@code
 *       number} (Long/Double)
 *   <li>No-op validators for {@code pattern} and {@code type} constraints
 *   <li>{@code enableExceptionsAfterUnhandledBpmnError = true}
 *   <li>{@code historyTimeToLive = "P1D"} as a global default
 *   <li>BPMN parse listeners for start event and user task form variable initialization and {@code
 *       taskAssignee} injection
 * </ul>
 *
 * <p>This plugin is automatically detected and activated by the Python library when the {@code
 * *-vasara.jar} distribution is on the classpath.
 */
public class VasaraPlugin extends AbstractProcessEnginePlugin {

  @Override
  public void preInit(ProcessEngineConfigurationImpl configuration) {
    // --- Custom form types ---
    List<AbstractFormFieldType> formTypes = configuration.getCustomFormTypes();
    if (formTypes == null) {
      formTypes = new ArrayList<>();
      configuration.setCustomFormTypes(formTypes);
    }
    // Remove built-in DateFormType and LongFormType so our replacements take precedence
    formTypes.removeIf(t -> t instanceof DateFormType || t instanceof LongFormType);
    formTypes.add(new VasaraJsonFormType());
    formTypes.add(new VasaraDateFormType("dd/MM/yyyy"));
    formTypes.add(new VasaraNumberFormType());

    // --- Noop validators ---
    Map<String, Class<? extends FormFieldValidator>> validators =
        configuration.getCustomFormFieldValidators();
    if (validators == null) {
      validators = new java.util.HashMap<>();
      configuration.setCustomFormFieldValidators(validators);
    }
    validators.put("pattern", VasaraFormValidatorNoop.class);
    validators.put("type", VasaraFormValidatorNoop.class);

    // --- Raise exceptions for unhandled BPMN errors instead of silently ignoring them ---
    configuration.setEnableExceptionsAfterUnhandledBpmnError(true);

    // --- Global default history TTL (2 years) for definitions without explicit historyTimeToLive
    // ---
    configuration.setHistoryTimeToLive("P730D");

    // --- BPMN parse listeners ---
    List<BpmnParseListener> postParseListeners = configuration.getCustomPostBPMNParseListeners();
    if (postParseListeners == null) {
      postParseListeners = new ArrayList<>();
      configuration.setCustomPostBPMNParseListeners(postParseListeners);
    }
    postParseListeners.add(new VasaraBpmnParseListener());
  }

  @Override
  public void postInit(ProcessEngineConfigurationImpl configuration) {
    // Nothing to do after init
  }

  @Override
  public void postProcessEngineBuild(ProcessEngine engine) {
    // Nothing to do after build
  }
}

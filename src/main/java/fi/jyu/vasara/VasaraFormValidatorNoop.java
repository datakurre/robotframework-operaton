package fi.jyu.vasara;

import org.operaton.bpm.engine.impl.form.validator.FormFieldValidator;
import org.operaton.bpm.engine.impl.form.validator.FormFieldValidatorContext;

/** No-op form field validator. Always passes validation regardless of the submitted value. */
public class VasaraFormValidatorNoop implements FormFieldValidator {

  @Override
  public boolean validate(Object submittedValue, FormFieldValidatorContext validatorContext) {
    return true;
  }
}

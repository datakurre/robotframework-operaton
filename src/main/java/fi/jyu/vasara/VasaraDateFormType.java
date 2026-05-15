package fi.jyu.vasara;

import org.operaton.bpm.engine.impl.form.type.DateFormType;
import org.operaton.bpm.engine.variable.Variables;
import org.operaton.bpm.engine.variable.value.StringValue;
import org.operaton.bpm.engine.variable.value.TypedValue;

/** Date form field type that handles null and empty values gracefully. */
public class VasaraDateFormType extends DateFormType {

  public VasaraDateFormType(String datePattern) {
    super(datePattern);
  }

  @Override
  public TypedValue convertToFormValue(TypedValue modelValue) {
    if (modelValue.getValue() == null) {
      return Variables.stringValue("", modelValue.isTransient());
    } else if (modelValue instanceof StringValue
        && ((StringValue) modelValue).getValue().equals("")) {
      return Variables.stringValue("", modelValue.isTransient());
    } else {
      return super.convertToFormValue(modelValue);
    }
  }

  @Override
  public String convertModelValueToFormValue(Object modelValue) {
    return super.convertModelValueToFormValue(modelValue);
  }
}

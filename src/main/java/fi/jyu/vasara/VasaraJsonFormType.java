package fi.jyu.vasara;

import org.operaton.bpm.engine.impl.form.type.AbstractFormFieldType;
import org.operaton.bpm.engine.variable.Variables;
import org.operaton.bpm.engine.variable.value.TypedValue;
import org.operaton.spin.plugin.variable.SpinValues;
import org.operaton.spin.plugin.variable.value.impl.JsonValueImpl;

/** Custom form field type that accepts JSON values as strings. */
public class VasaraJsonFormType extends AbstractFormFieldType {

  public static final String TYPE_NAME = "json";

  @Override
  public String getName() {
    return TYPE_NAME;
  }

  @Override
  public TypedValue convertToModelValue(TypedValue propertyValue) {
    if (propertyValue instanceof JsonValueImpl) {
      return propertyValue;
    }
    Object value = propertyValue.getValue();
    if (value == null) {
      return SpinValues.jsonValue("null").create();
    } else {
      return SpinValues.jsonValue(value.toString()).create();
    }
  }

  @Override
  public TypedValue convertToFormValue(TypedValue modelValue) {
    if (modelValue instanceof JsonValueImpl
        && ((JsonValueImpl) modelValue).getValueSerialized().equals("")) {
      return Variables.stringValue("null", modelValue.isTransient());
    }
    if (modelValue.getValue() == null) {
      return Variables.stringValue("null", modelValue.isTransient());
    } else {
      return Variables.stringValue(modelValue.getValue().toString(), modelValue.isTransient());
    }
  }

  // deprecated ///////////////////////////////////////////////////////////////

  @Override
  public Object convertFormValueToModelValue(Object propertyValue) {
    if (propertyValue == null) {
      return SpinValues.jsonValue("null").create();
    } else {
      return SpinValues.jsonValue(propertyValue.toString()).create();
    }
  }

  @Override
  public String convertModelValueToFormValue(Object modelValue) {
    if (modelValue == null) {
      return "null";
    } else if (modelValue instanceof JsonValueImpl) {
      return ((JsonValueImpl) modelValue).getValueSerialized();
    } else {
      return modelValue.toString();
    }
  }
}

package fi.jyu.vasara;

import org.operaton.bpm.engine.ProcessEngineException;
import org.operaton.bpm.engine.impl.form.type.LongFormType;
import org.operaton.bpm.engine.variable.Variables;
import org.operaton.bpm.engine.variable.impl.value.PrimitiveTypeValueImpl;
import org.operaton.bpm.engine.variable.value.DoubleValue;
import org.operaton.bpm.engine.variable.value.LongValue;
import org.operaton.bpm.engine.variable.value.TypedValue;

/** Numeric form field type that accepts both Long and Double values (including string input). */
public class VasaraNumberFormType extends LongFormType {

  @Override
  public TypedValue convertValue(TypedValue propertyValue) {
    if (propertyValue instanceof LongValue) {
      return propertyValue;
    } else if (propertyValue instanceof DoubleValue) {
      return propertyValue;
    } else {
      Object value = propertyValue.getValue();
      if (value == null || (value instanceof String && ((String) value).isEmpty())) {
        return Variables.longValue(null, propertyValue.isTransient());
      } else if (value instanceof Double
          || value instanceof java.lang.Float
          || value instanceof String) {
        return Variables.doubleValue(Double.valueOf(value.toString()), propertyValue.isTransient());
      } else if (value instanceof Number) {
        return Variables.longValue(Long.valueOf(value.toString()), propertyValue.isTransient());
      } else {
        throw new ProcessEngineException("Value '" + value + "' is not of type Long or Double.");
      }
    }
  }

  // deprecated ///////////////////////////////////////////////////////////////

  @Override
  public Object convertFormValueToModelValue(Object propertyValue) {
    if (propertyValue instanceof PrimitiveTypeValueImpl.DoubleValueImpl) {
      return ((PrimitiveTypeValueImpl.DoubleValueImpl) propertyValue).getValue();
    } else if (propertyValue instanceof PrimitiveTypeValueImpl.LongValueImpl) {
      return ((PrimitiveTypeValueImpl.LongValueImpl) propertyValue).getValue();
    } else {
      return super.convertFormValueToModelValue(propertyValue);
    }
  }
}

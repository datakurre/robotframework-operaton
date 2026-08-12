/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Camunda 7 to Operaton Compatibility Shims for JavaScript/GraalJS Scripts.
 *
 * This environment script provides backward compatibility for BPMN scripts
 * that reference Camunda 7 classes. It creates shims that map old Camunda
 * class references to their Operaton equivalents.
 *
 * Usage in BPMN scripts remains unchanged:
 *   var BpmnError = Java.type('org.camunda.bpm.engine.delegate.BpmnError');
 *   throw new BpmnError('ERROR_CODE', 'Error message');
 *
 * The shims intercept these references and redirect them to Operaton classes.
 */

// Create a namespace object for the Camunda compatibility layer
var __vasara_camunda_compat = (function () {
  "use strict";

  // Store original Java.type function
  var originalJavaType = Java.type;

  // Mapping from Camunda 7 class names to Operaton class names
  var classMapping = {
    // BpmnError for throwing BPMN errors from scripts
    "org.camunda.bpm.engine.delegate.BpmnError":
      "org.operaton.bpm.engine.delegate.BpmnError",

    // Variables utility for creating typed values (including fileValue)
    "org.camunda.bpm.engine.variable.Variables":
      "org.operaton.bpm.engine.variable.Variables",

    // Spin JSON handling classes
    "org.camunda.spin.json.SpinJsonNode": "org.operaton.spin.json.SpinJsonNode",
    "org.camunda.spin.plugin.variable.SpinValues":
      "org.operaton.spin.plugin.variable.SpinValues",
    "org.camunda.spin.Spin": "org.operaton.spin.Spin",

    // Additional Spin classes that might be referenced
    "org.camunda.spin.xml.SpinXmlElement":
      "org.operaton.spin.xml.SpinXmlElement",
    "org.camunda.spin.xml.SpinXmlNode": "org.operaton.spin.xml.SpinXmlNode",
    "org.camunda.spin.DataFormats": "org.operaton.spin.DataFormats",

    // Connect plugin classes
    "org.camunda.connect.Connectors": "org.operaton.connect.Connectors",
    "org.camunda.connect.plugin.ConnectProcessEnginePlugin":
      "org.operaton.connect.plugin.ConnectProcessEnginePlugin",
  };

  // Override Java.type to intercept Camunda class lookups
  Java.type = function (className) {
    var mappedClass = classMapping[className];
    if (mappedClass) {
      return originalJavaType(mappedClass);
    }
    return originalJavaType(className);
  };

  // Provide convenience variables for commonly used Spin functions
  // These mirror what Operaton's spin.js environment script provides
  // but with Camunda-compatible naming

  return {
    originalJavaType: originalJavaType,
    classMapping: classMapping,
  };
})();

// Create package-like structure for org.camunda namespace
// This allows direct class access like: org.camunda.spin.Spin.S('...')
var org = org || {};
org.camunda = org.camunda || {};
org.camunda.bpm = org.camunda.bpm || {};
org.camunda.bpm.engine = org.camunda.bpm.engine || {};
org.camunda.bpm.engine.delegate = org.camunda.bpm.engine.delegate || {};
org.camunda.bpm.engine.variable = org.camunda.bpm.engine.variable || {};
org.camunda.spin = org.camunda.spin || {};
org.camunda.spin.json = org.camunda.spin.json || {};
org.camunda.spin.xml = org.camunda.spin.xml || {};
org.camunda.spin.plugin = org.camunda.spin.plugin || {};
org.camunda.spin.plugin.variable = org.camunda.spin.plugin.variable || {};
org.camunda.connect = org.camunda.connect || {};

// Map Camunda classes to Operaton equivalents
org.camunda.bpm.engine.delegate.BpmnError = Java.type(
  "org.operaton.bpm.engine.delegate.BpmnError",
);
org.camunda.bpm.engine.variable.Variables = Java.type(
  "org.operaton.bpm.engine.variable.Variables",
);
org.camunda.spin.Spin = Java.type("org.operaton.spin.Spin");
org.camunda.spin.json.SpinJsonNode = Java.type(
  "org.operaton.spin.json.SpinJsonNode",
);
org.camunda.spin.plugin.variable.SpinValues = Java.type(
  "org.operaton.spin.plugin.variable.SpinValues",
);

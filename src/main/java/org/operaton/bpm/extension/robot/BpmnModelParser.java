package org.operaton.bpm.extension.robot;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import org.operaton.bpm.model.bpmn.Bpmn;
import org.operaton.bpm.model.bpmn.BpmnModelInstance;
import org.operaton.bpm.model.bpmn.instance.FlowNode;
import org.operaton.bpm.model.bpmn.instance.Process;
import org.operaton.bpm.model.bpmn.instance.SequenceFlow;
import org.operaton.bpm.model.xml.instance.ModelElementInstance;

/**
 * Parses BPMN XML models to extract executable flow nodes and sequence flows. Uses Operaton's model
 * API to match the test coverage library's element extraction rules.
 */
public final class BpmnModelParser {

  private BpmnModelParser() {}

  /** Holds executable flow nodes and sequence flow paths for a process definition. */
  public static class ExecutableElements {
    private final Map<String, String> nodes = new LinkedHashMap<>();
    private final Set<String> paths = new LinkedHashSet<>();

    public Map<String, String> getNodes() {
      return Collections.unmodifiableMap(nodes);
    }

    public Set<String> getPaths() {
      return Collections.unmodifiableSet(paths);
    }
  }

  /**
   * Extracts executable flow nodes and sequence flow paths from BPMN XML for the given process
   * definition key.
   *
   * @param xml BPMN XML string
   * @param processDefinitionKey process definition ID/key
   * @return executable elements
   */
  public static ExecutableElements parse(String xml, String processDefinitionKey) {
    ExecutableElements result = new ExecutableElements();
    if (xml == null
        || xml.isBlank()
        || processDefinitionKey == null
        || processDefinitionKey.isBlank()) {
      return result;
    }

    BpmnModelInstance modelInstance =
        Bpmn.readModelFromStream(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));

    Collection<FlowNode> allFlowNodes = modelInstance.getModelElementsByType(FlowNode.class);
    Set<FlowNode> executableFlowNodes = new LinkedHashSet<>();
    for (FlowNode node : allFlowNodes) {
      if (isExecutable(node, processDefinitionKey)) {
        executableFlowNodes.add(node);
        if (node.getId() != null) {
          result.nodes.put(node.getId(), node.getName());
        }
      }
    }

    Collection<SequenceFlow> allSequenceFlows =
        modelInstance.getModelElementsByType(SequenceFlow.class);
    for (SequenceFlow sf : allSequenceFlows) {
      if (sf.getId() != null
          && sf.getSource() != null
          && executableFlowNodes.contains(sf.getSource())) {
        result.paths.add(sf.getId());
      }
    }

    return result;
  }

  private static boolean isExecutable(ModelElementInstance node, String processId) {
    if (node == null) {
      return false;
    }
    if (node instanceof Process process) {
      return process.isExecutable() && processId.equals(process.getId());
    }
    return isExecutable(node.getParentElement(), processId);
  }
}

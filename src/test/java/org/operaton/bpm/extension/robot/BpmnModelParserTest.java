package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class BpmnModelParserTest {

  @Test
  void extractsExecutableElementsForMultiTaskProcess() throws Exception {
    String xml = Files.readString(Path.of("src/test/resources/example/multi-task-process.bpmn"));
    BpmnModelParser.ExecutableElements elements = BpmnModelParser.parse(xml, "multi-task-process");

    assertThat(elements.getNodes())
        .containsOnlyKeys("StartEvent_1", "fork", "task-a", "task-b", "join", "EndEvent_1");
    assertThat(elements.getNodes().get("task-a")).isEqualTo("Task A");
    assertThat(elements.getNodes().get("task-b")).isEqualTo("Task B");
    assertThat(elements.getNodes().get("StartEvent_1")).isNull();

    assertThat(elements.getPaths())
        .containsExactlyInAnyOrder("Flow_1", "Flow_2", "Flow_3", "Flow_4", "Flow_5", "Flow_6");
  }

  @Test
  void extractsExecutableElementsForXorGatewayProcess() throws Exception {
    String xml = Files.readString(Path.of("src/test/resources/example/xor-gateway-process.bpmn"));
    BpmnModelParser.ExecutableElements elements = BpmnModelParser.parse(xml, "xor-gateway-process");

    assertThat(elements.getNodes())
        .containsOnlyKeys(
            "StartEvent_1",
            "review-task",
            "approval-gateway",
            "approved-task",
            "rejected-task",
            "EndEvent_1",
            "EndEvent_2");
    assertThat(elements.getNodes().get("review-task")).isEqualTo("Review");
    assertThat(elements.getNodes().get("approval-gateway")).isEqualTo("Approved?");

    assertThat(elements.getPaths())
        .containsExactlyInAnyOrder(
            "Flow_1", "Flow_2", "Flow_approved", "Flow_rejected", "Flow_3", "Flow_4");
  }
}

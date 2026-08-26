*** Settings ***
Library             Operaton

Suite Setup         Setup Process Engine
Suite Teardown      Suite Teardown


*** Test Cases ***
Complete Without Default Path
    [Documentation]    Completes the primary task without setting the value variable and verifies the default
    Deploy Resources    ${CURDIR}${/}default-path.bpmn
    Start Instance    default-flow-process

    Execute Timer Jobs
    Set Process Variable    value    continue
    Complete Task    Activity_10na9k7
    Execute Jobs

    Log Bpmn Execution
    Log Bpmn Test Coverage    default-flow-process


*** Keywords ***
Suite Teardown
    Log Bpmn Test Coverage    default-flow-process
    Log Uncovered Bpmn Elements    default-flow-process
    Teardown Process Engine

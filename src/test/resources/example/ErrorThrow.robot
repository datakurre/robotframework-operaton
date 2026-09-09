*** Settings ***
Documentation       Isolates error-end to boundary-event behavior for signing abort.

Library             Operaton

Suite Setup         Setup Process Engine
Suite Teardown      Suite Teardown


*** Test Cases ***
Failure Triggers Boundary Catch
    [Documentation]    Completes the status external task with FAILURE and verifies subprocess error is caught by boundary event.
    Deploy Resources    ${CURDIR}${/}error-throw.bpmn
    Start Instance    error-throw-process

    Set Process Variable    value    failure
    Execute Jobs Until Wait State    wait_for=external_task    topic=value-enter
    Complete External Task For Topic
    ...    topic=value-enter

    Log Bpmn Execution
    Log Bpmn Test Coverage    error-throw-process

Success Triggers End Event
    [Documentation]    Completes the status external task with SUCCESS and verifies subprocess end event is reached.
    Deploy Resources    ${CURDIR}${/}error-throw.bpmn
    Start Instance    error-throw-process

    Set Process Variable    value    success
    Execute Jobs Until Wait State    wait_for=external_task    topic=value-enter
    Complete External Task For Topic
    ...    topic=value-enter

    Log Bpmn Execution


*** Keywords ***
Suite Teardown
    Log Bpmn Test Coverage    error-throw-process
    Log Uncovered Bpmn Elements    error-throw-process
    Teardown Process Engine

*** Settings ***
Documentation       Isolates error-end to boundary-event behavior for signing abort.

Library             Operaton


*** Test Cases ***
Failure Triggers Boundary Catch
    [Documentation]    Completes the status external task with FAILURE and verifies subprocess error is caught by boundary event.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}error-throw.bpmn
    Start Instance    error-throw-process

    Set Process Variable    value    failure
    Execute Jobs Until Wait State    wait_for=external_task    topic=value-enter
    Complete External Task For Topic
    ...    topic=value-enter

    Log Bpmn Execution
    [Teardown]    Teardown Process Engine

Success Triggers End Event
    [Documentation]    Completes the status external task with SUCCESS and verifies subprocess end event is reached.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}error-throw.bpmn
    Start Instance    error-throw-process

    Set Process Variable    value    success
    Execute Jobs Until Wait State    wait_for=external_task    topic=value-enter
    Complete External Task For Topic
    ...    topic=value-enter

    Log Bpmn Execution
    [Teardown]    Teardown Process Engine

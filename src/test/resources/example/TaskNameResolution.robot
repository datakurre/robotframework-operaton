*** Settings ***
Library     Operaton


*** Test Cases ***
Should Have Task By Task Name
    [Documentation]    Should Have Task accepts a human-readable task name instead of a definition key.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process
    Should Have Task    Review Request
    [Teardown]    Teardown Process Engine

Complete Task By Task Name
    [Documentation]    Complete Task accepts a human-readable task name instead of a definition key.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process
    Complete Task    Review Request
    Should Be Ended
    [Teardown]    Teardown Process Engine

Definition Key Also Works
    [Documentation]    Passing the task definition key directly also works.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process
    Complete Task    review-request
    Should Be Ended
    [Teardown]    Teardown Process Engine

Task Name Resolution Without Explicit Instance
    [Documentation]    Task name resolution works together with current-instance state.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process
    Should Have Task    name=Review Request
    Complete Task    name=Review Request
    Should Be Ended
    [Teardown]    Teardown Process Engine

*** Settings ***

Library    ProcessEngine
Library    Collections

*** Test Cases ***

Throw Bpmn Error Triggers Error Boundary Event
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}error-boundary-process.bpmn
    ${instance}=    Start Instance    error-boundary-process
    ${tasks}=    Fetch And Lock    validationTopic
    ${task_id}=    Get From List    ${tasks}    0
    Throw Bpmn Error    ${task_id}    VALIDATION_ERROR    Validation failed
    Should Have Task    ${instance}    error-task

Complete External Task Takes Happy Path
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}error-boundary-process.bpmn
    ${instance}=    Start Instance    error-boundary-process
    ${tasks}=    Fetch And Lock    validationTopic
    ${task_id}=    Get From List    ${tasks}    0
    Complete External Task    ${task_id}
    Should Have Task    ${instance}    success-task

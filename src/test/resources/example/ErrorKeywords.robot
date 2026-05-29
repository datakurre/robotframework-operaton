*** Settings ***
Library     Operaton
Library     Collections


*** Test Cases ***
Throw Bpmn Error Triggers Error Boundary Event
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}error-boundary-process.bpmn
    Start Instance    error-boundary-process
    ${tasks}=    Fetch And Lock    validationTopic
    ${task_id}=    Get From List    ${tasks}    0
    Throw Bpmn Error    ${task_id}    VALIDATION_ERROR    Validation failed
    Should Have Task    error-task
    [Teardown]    Teardown Process Engine

Complete External Task Takes Happy Path
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}error-boundary-process.bpmn
    Start Instance    error-boundary-process
    ${tasks}=    Fetch And Lock    validationTopic
    ${task_id}=    Get From List    ${tasks}    0
    Complete External Task    ${task_id}
    Should Have Task    success-task
    [Teardown]    Teardown Process Engine

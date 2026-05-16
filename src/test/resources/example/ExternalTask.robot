*** Settings ***

Library    Operaton
Library    Collections

*** Test Cases ***

Fetch And Lock Returns External Tasks
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}external-task-process.bpmn
    Start Instance    external-task-process
    ${tasks}=    Fetch And Lock    myTopic
    ${count}=    Get Length    ${tasks}
    Should Be Equal As Integers    ${count}    1

Complete External Task Advances Process
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}external-task-process.bpmn
    Start Instance    external-task-process
    ${tasks}=    Fetch And Lock    myTopic
    ${task_id}=    Get From List    ${tasks}    0
    Complete External Task    ${task_id}
    Should Have Task    review-external-result

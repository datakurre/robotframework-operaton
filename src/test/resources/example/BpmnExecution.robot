*** Settings ***

Library    Operaton
Library    Collections

*** Test Cases ***

Get Activity History Returns Activity List
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Log Bpmn Execution
    Complete Task    task-a
    Log Bpmn Execution
    Complete Task    task-b
    Log Bpmn Execution
    ${activities}=    Get Activity History
    ${count}=    Get Length    ${activities}
    Should Be True    ${count} >= 3
    ${first}=    Get From List    ${activities}    0
    Dictionary Should Contain Key    ${first}    activityId
    Dictionary Should Contain Key    ${first}    activityType
    Dictionary Should Contain Key    ${first}    canceled
    Dictionary Should Contain Key    ${first}    completed

Get Process Model Xml Returns Bpmn
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    ${def_id}=    Get Process Definition Id
    ${xml}=    Get Process Model Xml    ${def_id}
    Should Contain    ${xml}    bpmn:definitions
    Should Contain    ${xml}    multi-task-process

Get Process Definition Id Returns Id
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Complete Task    task-a
    Complete Task    task-b
    ${def_id}=    Get Process Definition Id
    Should Not Be Empty    ${def_id}
    Should Contain    ${def_id}    multi-task-process

Log Bpmn Execution Logs Svg When Node Available
    [Documentation]    Logs an SVG image of the executed path.
    ...    If 'node' is not on PATH this keyword skips gracefully.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Complete Task    task-a
    Complete Task    task-b
    Log Bpmn Execution

Log Bpmn Partial Execution Only Task A Completed
    [Documentation]    Shows partial execution: task-a done, task-b still active.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Complete Task    task-a
    Log Bpmn Execution

Log Bpmn No Tasks Completed Yet
    [Documentation]    Shows an instance just started, both parallel tasks active.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Log Bpmn Execution

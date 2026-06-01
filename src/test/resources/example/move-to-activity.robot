*** Settings ***

Library    Operaton

*** Test Cases ***

Move To Activity
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}xor-gateway-process.bpmn
    Start Instance    xor-gateway-process
    Move Instance To    rejected-task
    Should Have Task    rejected-task
    Complete Task    rejected-task
    Log Bpmn Execution

Move Instance To Fails When Multiple Tokens
    [Documentation]    Verifies move_instance_to raises when multiple active tokens exist.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    ${id}=    Start Instance    multi-task-process
    ${acts}=    Get Active Activities    ${id}
    ${count}=    Get Length    ${acts}
    Should Be Equal As Integers    ${count}    2
    Run Keyword And Expect Error
    ...    *requires exactly one active token*
    ...    Move Instance To    Activity_T1    ${id}
    Log Bpmn Execution

Move Instance To Fails When No Active Token
    [Documentation]    Verifies move_instance_to raises when instance has finished.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    ${id}=    Start Instance    multi-task-process
    Complete Task    Task A    ${id}
    Complete Task    Task B    ${id}
    Run Keyword And Expect Error
    ...    *requires exactly one active token*
    ...    Move Instance To    Activity_T1    ${id}
    Log Bpmn Execution

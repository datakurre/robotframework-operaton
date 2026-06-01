*** Settings ***
Library    Operaton
Library    Collections

*** Test Cases ***

Move Instance To Fails When Multiple Tokens
    [Documentation]    Verifies move_instance_to raises when multiple active tokens exist.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}parallel-process.bpmn
    ${id}=    Start Instance    parallel-process
    ${acts}=    Get Active Activities    ${id}
    ${count}=    Get Length    ${acts}
    Should Be Equal As Integers    ${count}    2
    Run Keyword And Expect Error    .*requires exactly one active token.*    Move Instance To    Activity_T1    ${id}

Move Instance To Moves Single Token
    [Documentation]    Verifies move_instance_to moves a single token from one activity to another.
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-process.bpmn
    ${id}=    Start Instance    sequential-process
    Should Have Task    Task A    ${id}
    Move Instance To    Activity_B    ${id}
    Should Have Task    Task B    ${id}
    Should Not Have Task    Task A    ${id}

Move Instance To Fails When No Active Token
    [Documentation]    Verifies move_instance_to raises when instance has finished (no active tokens).
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-process.bpmn
    ${id}=    Start Instance    sequential-process
    Complete Task    Task A    ${id}
    Complete Task    Task B    ${id}
    Run Keyword And Expect Error    .*requires exactly one active token.*    Move Instance To    Activity_A    ${id}

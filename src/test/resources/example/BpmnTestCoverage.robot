*** Settings ***
Library     Operaton


*** Test Cases ***
Log Bpmn Test Coverage After Full Execution
    [Documentation]    Runs a process to completion, then logs a coverage table
    ...    and a highlighted SVG of the fully covered definition.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Complete Task    task-a
    Complete Task    task-b
    Should Be Ended
    Log Bpmn Test Coverage    multi-task-process
    [Teardown]    Teardown Process Engine

Log Bpmn Test Coverage After Partial Execution
    [Documentation]    Only one of the parallel tasks is completed, so coverage is
    ...    partial; the table and SVG reflect the covered subset.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Complete Task    task-a
    Log Bpmn Test Coverage    multi-task-process
    [Teardown]    Teardown Process Engine

Log Bpmn Test Coverage Table Only Without Definition
    [Documentation]    Omitting the definition logs just the coverage table for all
    ...    exercised definitions.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Log Bpmn Test Coverage
    [Teardown]    Teardown Process Engine

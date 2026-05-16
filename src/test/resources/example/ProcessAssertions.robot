*** Settings ***

Library    Operaton

*** Test Cases ***

Process Should Be Active After Start
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Should Be Active

Process Should Be Ended After Completion
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Complete Task    say-hello
    Should Be Ended

Process Should Be Suspended
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Suspend Instance
    Should Be Suspended

Process Should Be Active After Reactivation
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Suspend Instance
    Should Be Suspended
    Activate Instance
    Should Be Active

Multi Task Process Should Have N Active Tasks
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Should Have N Active Tasks    2

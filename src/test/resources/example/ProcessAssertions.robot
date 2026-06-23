*** Settings ***
Library     Operaton


*** Test Cases ***
Process Should Be Active After Start
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Should Be Active
    [Teardown]    Teardown Process Engine

Process Should Be Ended After Completion
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Complete Task    say-hello
    Should Be Ended
    [Teardown]    Teardown Process Engine

Process Should Be Suspended
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Suspend Instance
    Should Be Suspended
    [Teardown]    Teardown Process Engine

Process Should Be Active After Reactivation
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Suspend Instance
    Should Be Suspended
    Activate Instance
    Should Be Active
    [Teardown]    Teardown Process Engine

Should Have Active Checks Activity Instances
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Should Have Active    times=2
    Should Have Active    task-a
    Should Have Active    task-b    times=1
    [Teardown]    Teardown Process Engine

Should Have Completed Checks Activity Instances
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    Start Instance    multi-task-process
    Should Have Completed    StartEvent_1
    Should Have Completed    EndEvent_1    times=0
    Complete Task    task-a
    Complete Task    task-b
    Should Have Completed    task-a
    Should Have Completed    task-b    times=1
    Should Have Completed    EndEvent_1
    [Teardown]    Teardown Process Engine

Process Should Be Ended After Stop Instance
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Stop Instance
    Should Be Ended
    [Teardown]    Teardown Process Engine

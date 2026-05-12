*** Settings ***

Library    ProcessEngine

*** Test Cases ***

Process Should Be Active After Start
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Should Be Active    ${instance}

Process Should Be Ended After Completion
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Complete Task    ${instance}    say-hello
    Should Be Ended    ${instance}

Process Should Be Suspended
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Suspend Instance    ${instance}
    Should Be Suspended    ${instance}

Process Should Be Active After Reactivation
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Suspend Instance    ${instance}
    Should Be Suspended    ${instance}
    Activate Instance    ${instance}
    Should Be Active    ${instance}

Multi Task Process Should Have N Active Tasks
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}multi-task-process.bpmn
    ${instance}=    Start Instance    multi-task-process
    Should Have N Active Tasks    ${instance}    2

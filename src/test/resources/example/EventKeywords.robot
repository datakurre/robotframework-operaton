*** Settings ***

Library    Operaton

*** Test Cases ***

Signal Event Advances Process
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}signal-process.bpmn
    ${instance}=    Start Instance    signal-process
    Signal Event    ApprovalSignal
    Should Have Task    ${instance}    approved-task

Throw Signal Is Alias For Signal Event
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}signal-process.bpmn
    ${instance}=    Start Instance    signal-process
    Throw Signal    ApprovalSignal
    Should Have Task    ${instance}    approved-task

Correlate Message Advances Process
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}message-process.bpmn
    ${instance}=    Start Instance    message-process
    Correlate Message    DataMessage    ${instance}
    Should Have Task    ${instance}    data-received-task

Send Message Is Alias For Correlate Message
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}message-process.bpmn
    ${instance}=    Start Instance    message-process
    Send Message    DataMessage    ${instance}
    Should Have Task    ${instance}    data-received-task

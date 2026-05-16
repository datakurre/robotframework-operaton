*** Settings ***

Library    Operaton

*** Test Cases ***

Signal Event Advances Process
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}signal-process.bpmn
    Start Instance    signal-process
    Signal Event    ApprovalSignal
    Should Have Task    approved-task

Throw Signal Is Alias For Signal Event
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}signal-process.bpmn
    Start Instance    signal-process
    Throw Signal    ApprovalSignal
    Should Have Task    approved-task

Correlate Message Advances Process
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}message-process.bpmn
    Start Instance    message-process
    Correlate Message    DataMessage
    Should Have Task    data-received-task

Send Message Is Alias For Correlate Message
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}message-process.bpmn
    Start Instance    message-process
    Send Message    DataMessage
    Should Have Task    data-received-task

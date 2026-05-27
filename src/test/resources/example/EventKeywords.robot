*** Settings ***
Library     Operaton


*** Test Cases ***
Signal Event Advances Process
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}signal-process.bpmn
    Start Instance    signal-process
    Signal Event    ApprovalSignal
    Should Have Task    approved-task
    [Teardown]    Teardown Process Engine

Throw Signal Is Alias For Signal Event
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}signal-process.bpmn
    Start Instance    signal-process
    Throw Signal    ApprovalSignal
    Should Have Task    approved-task
    [Teardown]    Teardown Process Engine

Correlate Message Advances Process
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}message-process.bpmn
    Start Instance    message-process
    Correlate Message    DataMessage
    Should Have Task    data-received-task
    [Teardown]    Teardown Process Engine

Send Message Is Alias For Correlate Message
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}message-process.bpmn
    Start Instance    message-process
    Send Message    DataMessage
    Should Have Task    data-received-task
    [Teardown]    Teardown Process Engine

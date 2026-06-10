*** Settings ***
Library     Operaton


*** Test Cases ***
Complete A User Task
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Should Have Task    say-hello
    Complete Task    say-hello
    [Teardown]    Teardown Process Engine

XOR Gateway Takes Approved Path When Variable Is True
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}xor-gateway-process.bpmn
    Start Instance    xor-gateway-process
    Complete Task    review-task    approved=${True}
    Should Have Task    approved-task
    [Teardown]    Teardown Process Engine

XOR Gateway Takes Default Rejected Path When Variable Is False
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}xor-gateway-process.bpmn
    Start Instance    xor-gateway-process
    Complete Task    review-task    approved=${False}
    Should Have Task    rejected-task
    Log Bpmn Execution
    [Teardown]    Teardown Process Engine

XOR Gateway Takes Default Path When No Variable Is Provided
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}xor-gateway-process.bpmn
    Start Instance    xor-gateway-process
    Complete Task    review-task    approved=${EMPTY}
    Should Have Task    rejected-task
    [Teardown]    Teardown Process Engine

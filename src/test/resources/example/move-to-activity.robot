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

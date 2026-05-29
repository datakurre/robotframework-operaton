*** Settings ***
Library     Operaton


*** Test Cases ***
Script Task Sets Process Variable Via GraalJS
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}script-task-process.bpmn
    Start Instance    script-task-process
    Should Have Task    review-script-result
    ${result}=    Get Variable    result
    Should Be Equal    ${result}    hello from GraalJS
    [Teardown]    Teardown Process Engine

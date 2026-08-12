*** Settings ***
Library     Operaton


*** Test Cases ***
Camunda Compatibility Script Is Loaded For JavaScript Script Tasks
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}camunda-compat-process.bpmn
    Start Instance    camunda-compat-process
    Should Have Task    review-camunda-compat-result
    ${result}=    Get Process Variable    result
    Should Be Equal    ${result}    hello from camunda-compat
    [Teardown]    Teardown Process Engine

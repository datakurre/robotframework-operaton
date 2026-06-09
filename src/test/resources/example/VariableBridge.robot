*** Settings ***
Library     Operaton


*** Test Cases ***
Set And Get Process Variable
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Set Process Variable    myVar    hello-robot
    ${value}=    Get Process Variable    myVar
    Should Be Equal    ${value}    hello-robot
    [Teardown]    Teardown Process Engine

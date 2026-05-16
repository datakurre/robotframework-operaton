*** Settings ***

Library    Operaton

*** Test Cases ***

Set And Get Process Variable
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Set Variable    myVar    hello-robot
    ${value}=    Get Variable    myVar
    Should Be Equal    ${value}    hello-robot

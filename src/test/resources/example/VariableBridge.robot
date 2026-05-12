*** Settings ***

Library    Operaton

*** Test Cases ***

Set And Get Process Variable
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Set Variable    ${instance}    myVar    hello-robot
    ${value}=    Get Variable    ${instance}    myVar
    Should Be Equal    ${value}    hello-robot

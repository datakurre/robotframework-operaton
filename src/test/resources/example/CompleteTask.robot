*** Settings ***

Library    Operaton

*** Test Cases ***

Complete A User Task
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Should Have Task    ${instance}    say-hello
    Complete Task    ${instance}    say-hello

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

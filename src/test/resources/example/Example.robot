*** Settings ***
Library     Operaton


*** Test Cases ***
First Run
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Should Have Task    say-hello
    [Teardown]    Teardown Process Engine

*** Settings ***

Library    Operaton

*** Test Cases ***

Execute Timer Jobs Advances Process
    [Setup]    Setup Process Engine
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    ${instance}=    Start Instance    timer-process
    Execute Timer Jobs    ${instance}
    Should Have Task    ${instance}    timer-fired-task

Set Clock And Advance Clock Work Together
    [Setup]    Setup Process Engine
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    Set Clock    2025-06-15T10:00:00
    ${instance}=    Start Instance    timer-process
    Advance Clock    3600000
    Execute Timer Jobs    ${instance}
    Should Have Task    ${instance}    timer-fired-task

Advance Clock By Two Hours
    [Setup]    Setup Process Engine
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    Set Clock    2025-01-01T00:00:00
    ${instance}=    Start Instance    timer-process
    Advance Clock    7200000
    Execute Timer Jobs    ${instance}
    Should Have Task    ${instance}    timer-fired-task

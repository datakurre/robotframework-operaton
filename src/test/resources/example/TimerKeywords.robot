*** Settings ***
Library     Operaton


*** Test Cases ***
Execute Timer Jobs Advances Process
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    Start Instance    timer-process
    Execute Timer Jobs
    Should Have Task    timer-fired-task
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine

Set Clock And Advance Clock Work Together
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    Set Clock    2025-06-15T10:00:00
    Start Instance    timer-process
    Advance Clock    3600000
    Execute Timer Jobs
    Should Have Task    timer-fired-task
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine

Advance Clock By Two Hours
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    Set Clock    2025-01-01T00:00:00
    Start Instance    timer-process
    Advance Clock    7200000
    Execute Timer Jobs
    Should Have Task    timer-fired-task
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine

Execute Jobs Can Be Limited To One
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}timer-process.bpmn
    Set Clock    2025-01-01T00:00:00
    Start Instance    timer-process
    Advance Clock    3600000
    ${count}=    Execute Jobs    max_jobs=1
    Should Be Equal As Integers    ${count}    1
    Should Have Task    timer-fired-task
    [Teardown]    Run Keywords    Reset Clock    AND    Teardown Process Engine

Execute Jobs Until External Task Stops At External Task
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}multi-event.bpmn
    Start Instance    multi-event-process
    Log Bpmn Execution
    Execute Jobs Until External Task    mail-send
    # Verify the external task is now pending and can be completed
    ${tasks}=    Fetch And Lock    mail-send
    ${count}=    Get Length    ${tasks}
    Should Be Equal As Integers    ${count}    1
    [Teardown]    Teardown Process Engine

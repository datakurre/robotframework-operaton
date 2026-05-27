*** Settings ***
Library     Operaton
Library     Collections


*** Test Cases ***
Get Completed Instances Returns Finished Processes
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Complete Task    say-hello
    ${completed}=    Get Completed Instances    my-project-process
    ${count}=    Get Length    ${completed}
    Should Be Equal As Integers    ${count}    1
    [Teardown]    Teardown Process Engine

Get Historic Variables After Process Completion
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    Start Instance    my-project-process
    Set Variable    testVar    testValue
    Complete Task    say-hello
    ${vars}=    Get Historic Variables
    Dictionary Should Contain Key    ${vars}    testVar
    [Teardown]    Teardown Process Engine

Get Completed Instances With No Matches Returns Empty
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${completed}=    Get Completed Instances    my-project-process
    ${count}=    Get Length    ${completed}
    Should Be Equal As Integers    ${count}    0
    [Teardown]    Teardown Process Engine

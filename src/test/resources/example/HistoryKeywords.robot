*** Settings ***

Library    ProcessEngine
Library    Collections

*** Test Cases ***

Get Completed Instances Returns Finished Processes
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Complete Task    ${instance}    say-hello
    ${completed}=    Get Completed Instances    my-project-process
    ${count}=    Get Length    ${completed}
    Should Be Equal As Integers    ${count}    1

Get Historic Variables After Process Completion
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Set Variable    ${instance}    testVar    testValue
    Complete Task    ${instance}    say-hello
    ${vars}=    Get Historic Variables    ${instance}
    Dictionary Should Contain Key    ${vars}    testVar

Get Completed Instances With No Matches Returns Empty
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${completed}=    Get Completed Instances    my-project-process
    ${count}=    Get Length    ${completed}
    Should Be Equal As Integers    ${count}    0

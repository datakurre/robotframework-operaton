*** Settings ***
Library     Operaton
Library     Collections


*** Test Cases ***
Start Before Second Activity Skips First
    [Documentation]    Verifies the token lands at Task B, bypassing Task A entirely.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    ${id}=    Start Instance Before Activity    Process_1    task-b
    Log Bpmn Execution
    Should Have Task    Task B    ${id}
    [Teardown]    Teardown Process Engine

Start Before Activity Stores Current Instance
    [Documentation]    Verifies the instance is stored as current (no explicit id needed afterwards).
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    Start Instance Before Activity    Process_1    task-b
    Should Have Task    Task B
    Complete Task    Task B
    Should Be Ended
    [Teardown]    Teardown Process Engine

Start Before Activity Respects Provided Variables
    [Documentation]    Verifies variables passed to Start Instance Before Activity are
    ...    available on the instance for gateway conditions.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}xor-gateway-process.bpmn
    ${approved}=    Create Boolean Variable    true
    Start Instance Before Activity    xor-gateway-process    approval-gateway
    ...    approved=${approved}
    Log Bpmn Execution
    Should Have Task    Process Approval
    [Teardown]    Teardown Process Engine

Start Before Activity Uses Provided Business Key
    [Documentation]    Verifies a custom business key is stored and retrievable.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    Start Instance Before Activity    Process_1    task-b    business_key=my-key-001
    ${bk}=    Get Current Business Key
    Should Be Equal    ${bk}    my-key-001
    [Teardown]    Teardown Process Engine

Start Before Activity Generates Business Key When Omitted
    [Documentation]    Verifies a UUID business key is auto-generated when not provided.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    Start Instance Before Activity    Process_1    task-b
    ${bk}=    Get Current Business Key
    Should Not Be Empty    ${bk}
    [Teardown]    Teardown Process Engine

Start Before Activity Returns Instance Id
    [Documentation]    Verifies the return value is the running instance id and matches
    ...    the stored current instance.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    ${id}=    Start Instance Before Activity    Process_1    task-b
    Should Not Be Empty    ${id}
    ${current}=    Get Current Instance
    Should Be Equal    ${id}    ${current}
    [Teardown]    Teardown Process Engine

Start Before First Activity Behaves Like Normal Start
    [Documentation]    Verifies that starting before the first user task is equivalent
    ...    to a normal Start Instance.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    Start Instance Before Activity    Process_1    task-a
    Should Have Task    Task A
    Complete Task    Task A
    Should Have Task    Task B
    Complete Task    Task B
    Should Be Ended
    [Teardown]    Teardown Process Engine

Start Before Activity Resolves BPMN Activity Name
    [Documentation]    Verifies a descriptive BPMN element name can be used instead of the technical id.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}sequential-activities.bpmn
    Start Instance Before Activity    Process_1    Task B
    Should Have Task    Task B
    [Teardown]    Teardown Process Engine

*** Settings ***
Library     Operaton


*** Test Cases ***
Start Instance With User Id Sets Initiator Variable
    [Documentation]    Verifies that when user_id is passed to Start Instance and the
    ...    BPMN start event declares camunda:initiator="author", the process variable
    ...    "author" contains the supplied user id after the instance is started.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    Start Instance    initiator-process    user_id=alice
    ${author}=    Get Process Variable    author
    Should Be Equal    ${author}    alice
    [Teardown]    Teardown Process Engine

Start Instance With Variables With User Id Sets Initiator Variable
    [Documentation]    Verifies that Start Instance With Variables also populates the
    ...    initiator variable when user_id is supplied.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    Start Instance With Variables    initiator-process    user_id=frank
    ${author}=    Get Process Variable    author
    Should Be Equal    ${author}    frank
    [Teardown]    Teardown Process Engine

Start Instance With User Id Stores Current Instance
    [Documentation]    Verifies that Start Instance with user_id still stores the
    ...    instance as the current instance usable by subsequent keywords.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    ${id}=    Start Instance    initiator-process    user_id=bob
    ${current}=    Get Current Instance
    Should Be Equal    ${id}    ${current}
    [Teardown]    Teardown Process Engine

Start Instance Without User Id Leaves Initiator Variable Empty
    [Documentation]    Verifies that when no user_id is given, the initiator variable
    ...    is not set (None).
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    Start Instance    initiator-process
    ${author}=    Get Process Variable    author
    Should Be Equal    ${author}    ${None}
    [Teardown]    Teardown Process Engine

Start Instance Before Activity With User Id Starts Successfully
    [Documentation]    Verifies that Start Instance Before Activity accepts user_id,
    ...    sets the authenticated user before execution, and starts the instance.
    ...    Note: the initiator variable is not populated because the start event is
    ...    bypassed when placing the token directly before an activity.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    ${id}=    Start Instance Before Activity    initiator-process    task-review    user_id=carol
    Should Not Be Empty    ${id}
    Should Have Task    Review
    [Teardown]    Teardown Process Engine

Start Instance Before Activity With User Id Stores Current Instance
    [Documentation]    Verifies that Start Instance Before Activity with user_id still
    ...    stores the instance as the current instance.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    ${id}=    Start Instance Before Activity    initiator-process    task-review    user_id=dave
    ${current}=    Get Current Instance
    Should Be Equal    ${id}    ${current}
    [Teardown]    Teardown Process Engine

Complete Task With User Id Completes Successfully
    [Documentation]    Verifies that Complete Task accepts a user_id and completes the
    ...    task normally. The authenticated user is set before completion and cleared
    ...    after so asynchronous continuation jobs run unauthenticated.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    Start Instance    initiator-process    user_id=alice
    Complete Task    Review    user_id=alice
    Should Be Ended
    [Teardown]    Teardown Process Engine

Complete Task With User Id Clears Authentication After Completion
    [Documentation]    Verifies the authenticated user is cleared after Complete Task
    ...    so subsequent engine operations run without an authenticated principal.
    ...    Confirmed by starting a second instance without user_id and asserting the
    ...    initiator variable is None — which would fail if a previous user leaked.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}initiator-process.bpmn
    Start Instance    initiator-process    user_id=alice
    Complete Task    Review    user_id=alice
    Start Instance    initiator-process
    ${author}=    Get Process Variable    author
    Should Be Equal    ${author}    ${None}
    [Teardown]    Teardown Process Engine

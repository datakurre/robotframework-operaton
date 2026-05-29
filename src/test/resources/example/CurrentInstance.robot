*** Settings ***
Library     Operaton


*** Test Cases ***
Start Instance Sets Current Instance State
    [Documentation]    After Start Instance, subsequent keywords work without explicit instance ID.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    ${instance}=    Start Instance    current-instance-process
    Should Have Task    name=review-request
    Complete Task    name=review-request
    Should Be Ended
    [Teardown]    Teardown Process Engine

Business Key Auto Generated As UUID4
    [Documentation]    When no business key is given, Start Instance generates a non-empty UUID4.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process
    ${bk}=    Get Current Business Key
    Should Not Be Empty    ${bk}
    Should Match Regexp    ${bk}    ^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
    [Teardown]    Teardown Process Engine

Explicit Business Key Is Stored In State
    [Documentation]    A business_key passed to Start Instance is retrievable via Get Current Business Key.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process    business_key=order-42
    ${bk}=    Get Current Business Key
    Should Be Equal    ${bk}    order-42
    [Teardown]    Teardown Process Engine

Get Current Instance Returns Instance ID
    [Documentation]    Get Current Instance returns the same ID that Start Instance returned.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    ${instance}=    Start Instance    current-instance-process
    ${current}=    Get Current Instance
    Should Be Equal    ${instance}    ${current}
    [Teardown]    Teardown Process Engine

Current Instance Used Across Multiple Keywords
    [Documentation]    Once started, the current instance is used automatically by all keywords.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}current-instance-process.bpmn
    Start Instance    current-instance-process
    Should Have Task    review-request
    Complete Task    review-request
    Should Be Ended
    [Teardown]    Teardown Process Engine

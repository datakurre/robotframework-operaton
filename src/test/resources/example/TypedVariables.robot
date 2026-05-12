*** Settings ***

Library    ProcessEngine

*** Test Cases ***

Evaluate Decision With Integer Input High
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}order-priority.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    orderPriority    orderTotal=${total}
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    high

Evaluate Decision With Integer Input Medium
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}order-priority.dmn
    ${total}=    Create Integer Variable    750
    ${result}=    Evaluate Decision    orderPriority    orderTotal=${total}
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    medium

Evaluate Decision With Integer Input Low
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}order-priority.dmn
    ${total}=    Create Integer Variable    100
    ${result}=    Evaluate Decision    orderPriority    orderTotal=${total}
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    low

Create Boolean Variable
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${flag}=    Create Boolean Variable    true
    Should Not Be Equal    ${flag}    ${NONE}

Create Double Variable
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${price}=    Create Double Variable    99.99
    Should Not Be Equal    ${price}    ${NONE}

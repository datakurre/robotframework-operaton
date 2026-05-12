*** Settings ***

Library    ProcessEngine

*** Test Cases ***

String To Integer Coercion Via Create Integer Variable
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}order-priority.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    orderPriority    orderTotal=${total}
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    high

String To Double Coercion Via Create Double Variable
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${price}=    Create Double Variable    99.99
    Should Not Be Equal    ${price}    ${NONE}

String To Boolean Coercion True
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${flag}=    Create Boolean Variable    true
    Should Not Be Equal    ${flag}    ${NONE}

String To Boolean Coercion False
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${flag}=    Create Boolean Variable    false
    Should Not Be Equal    ${flag}    ${NONE}

String To Date Coercion
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${date}=    Create Date Variable    2025-06-15
    Should Not Be Equal    ${date}    ${NONE}

String To Date With Custom Pattern
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    ${date}=    Create Date Variable    15/06/2025    pattern=dd/MM/yyyy
    Should Not Be Equal    ${date}    ${NONE}

Integer Variable Used In DMN With Boundary Value
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}order-priority.dmn
    ${total}=    Create Integer Variable    1000
    ${result}=    Evaluate Decision    orderPriority    orderTotal=${total}
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    high

Integer Variable Used In DMN At Lower Boundary
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}order-priority.dmn
    ${total}=    Create Integer Variable    500
    ${result}=    Evaluate Decision    orderPriority    orderTotal=${total}
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    medium

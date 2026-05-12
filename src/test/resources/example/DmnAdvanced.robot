*** Settings ***

Library    ProcessEngine

*** Test Cases ***

Multi Output Decision Gold Express
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}shipping.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    shipping    customerType=gold    orderTotal=${total}
    ${row}=    Decision Single Result    ${result}
    Decision Result Should Contain    ${result}    discountPercent    15
    Decision Result Should Contain    ${result}    shippingMethod    express

Multi Output Decision Silver Standard
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}shipping.dmn
    ${total}=    Create Integer Variable    500
    ${result}=    Evaluate Decision    shipping    customerType=silver    orderTotal=${total}
    ${row}=    Decision Single Result    ${result}
    Decision Result Should Contain    ${result}    discountPercent    5
    Decision Result Should Contain    ${result}    shippingMethod    standard

Collect Entries From Decision Result
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}collect-policy.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
    Length Should Be    ${result}    3
    ${benefits}=    Collect Entries    ${result}    benefit
    Length Should Be    ${benefits}    3

Should Have Decision Definition After Deploy
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    Should Have Decision Definition    discount

DRG Evaluation Through Required Decision
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}drg.dmn
    ${result}=    Evaluate Decision    tierDiscount    customerType=gold
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    20

DRG Evaluation Silver Customer
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}drg.dmn
    ${result}=    Evaluate Decision    tierDiscount    customerType=silver
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    10

DRG Evaluation Default Customer
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}drg.dmn
    ${result}=    Evaluate Decision    tierDiscount    customerType=bronze
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    0

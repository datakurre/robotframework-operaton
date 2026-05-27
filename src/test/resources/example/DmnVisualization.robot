*** Settings ***
Library     Operaton


*** Test Cases ***
Log Dmn Result Single Match First Hit Policy
    [Documentation]    Renders discount decision table with gold customer match highlighted.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount    customerType=gold
    Log Dmn Result    discount
    Decision Result Should Contain    ${result}    discountPercent    15
    [Teardown]    Teardown Process Engine

Log Dmn Result Multi Output Decision
    [Documentation]    Renders shipping decision table with multi-output match highlighted.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}shipping.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    shipping    customerType=gold    orderTotal=${total}
    Log Dmn Result    shipping
    Decision Result Should Contain    ${result}    discountPercent    15
    Decision Result Should Contain    ${result}    shippingMethod    express
    [Teardown]    Teardown Process Engine

Log Dmn Result Collect Policy Multiple Matches
    [Documentation]    Renders benefits decision table with multiple matched rows highlighted.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}collect-policy.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
    Log Dmn Result    benefits
    Length Should Be    ${result}    3
    [Teardown]    Teardown Process Engine

Log Dmn Result Default Match
    [Documentation]    Renders discount table with the default (catch-all) rule highlighted.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount    customerType=bronze
    Log Dmn Result    discount
    Decision Result Should Contain    ${result}    discountPercent    0
    [Teardown]    Teardown Process Engine

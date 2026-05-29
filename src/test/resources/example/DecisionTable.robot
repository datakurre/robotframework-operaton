*** Settings ***
Library     Operaton


*** Test Cases ***
Evaluate Gold Customer Discount
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount    customerType=gold
    ${row}=    Decision Single Result    ${result}
    Decision Result Should Contain    ${result}    discountPercent    15
    [Teardown]    Teardown Process Engine

Evaluate Silver Customer Discount
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount    customerType=silver
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    10
    [Teardown]    Teardown Process Engine

Evaluate Default Customer Discount
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount    customerType=bronze
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    0
    [Teardown]    Teardown Process Engine

Evaluate Decision Table Explicitly
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision Table    discount    customerType=gold
    Decision Result Should Contain    ${result}    discountPercent    15
    [Teardown]    Teardown Process Engine

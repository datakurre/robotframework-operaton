*** Settings ***
Library     Operaton


*** Test Cases ***
Evaluate Non Existent Decision Should Fail
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    Run Keyword And Expect Error    *    Evaluate Decision    nonexistent    customerType=gold
    [Teardown]    Teardown Process Engine

Evaluate With Missing Input Falls To Default
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    0
    [Teardown]    Teardown Process Engine

Decision Single Entry Fails With Multiple Results
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}collect-policy.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
    Run Keyword And Expect Error    Expected exactly 1 matched rule*    Decision Single Entry    ${result}
    [Teardown]    Teardown Process Engine

Decision Single Result Fails With No Match
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}collect-policy.dmn
    ${total}=    Create Integer Variable    500
    ${result}=    Evaluate Decision    benefits    customerType=silver    orderTotal=${total}
    Run Keyword And Expect Error    Expected exactly 1 matched rule*    Decision Single Result    ${result}
    [Teardown]    Teardown Process Engine

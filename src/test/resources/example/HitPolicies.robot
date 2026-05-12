*** Settings ***

Library    Operaton

*** Test Cases ***

FIRST Hit Policy Returns First Match
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}discount.dmn
    ${result}=    Evaluate Decision    discount    customerType=gold
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Integers    ${entry}    15

UNIQUE Hit Policy Returns Single Match
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}unique-policy.dmn
    ${result}=    Evaluate Decision    gradeLabel    grade=A
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    Excellent

UNIQUE Hit Policy Grade B
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}unique-policy.dmn
    ${result}=    Evaluate Decision    gradeLabel    grade=B
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    Good

ANY Hit Policy With Multiple Matching Rules
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}any-policy.dmn
    ${result}=    Evaluate Decision    approval    categoryA=yes    categoryB=yes
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    approved

ANY Hit Policy With Single Match
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}any-policy.dmn
    ${result}=    Evaluate Decision    approval    categoryA=yes    categoryB=no
    ${entry}=    Decision Single Entry    ${result}
    Should Be Equal As Strings    ${entry}    approved

COLLECT Hit Policy Returns All Matches
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}collect-policy.dmn
    ${total}=    Create Integer Variable    1500
    ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
    Length Should Be    ${result}    3

COLLECT Hit Policy Single Match
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}collect-policy.dmn
    ${total}=    Create Integer Variable    500
    ${result}=    Evaluate Decision    benefits    customerType=gold    orderTotal=${total}
    Length Should Be    ${result}    1

RULE ORDER Hit Policy Returns All Matches In Order
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}rule-order-policy.dmn
    ${score}=    Create Integer Variable    150
    ${result}=    Evaluate Decision    badges    score=${score}
    Length Should Be    ${result}    3
    Decision Result Should Contain    ${result}    badge    platinum
    Decision Result Should Contain    ${result}    badge    gold
    Decision Result Should Contain    ${result}    badge    participant

RULE ORDER Hit Policy Partial Match
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}rule-order-policy.dmn
    ${score}=    Create Integer Variable    75
    ${result}=    Evaluate Decision    badges    score=${score}
    Length Should Be    ${result}    2
    Decision Result Should Contain    ${result}    badge    gold
    Decision Result Should Contain    ${result}    badge    participant

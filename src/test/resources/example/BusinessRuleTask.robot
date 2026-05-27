*** Settings ***
Library     Operaton


*** Test Cases ***
Business Rule Task Evaluates DMN Decision
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}business-rule-task.bpmn    ${CURDIR}${/}discount.dmn
    Start Instance With Variables    business-rule-process    customerType=gold
    Should Have Task    review-result
    ${discount}=    Get Variable    discountResult
    Should Be Equal As Integers    ${discount}    15
    [Teardown]    Teardown Process Engine

Business Rule Task With Silver Customer
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}business-rule-task.bpmn    ${CURDIR}${/}discount.dmn
    Start Instance With Variables    business-rule-process    customerType=silver
    Should Have Task    review-result
    ${discount}=    Get Variable    discountResult
    Should Be Equal As Integers    ${discount}    10
    [Teardown]    Teardown Process Engine

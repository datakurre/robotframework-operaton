*** Settings ***

Library    ProcessEngine

*** Test Cases ***

Business Rule Task Evaluates DMN Decision
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}business-rule-task.bpmn    ${CURDIR}${/}discount.dmn
    ${instance}=    Start Instance With Variables    business-rule-process    customerType=gold
    Should Have Task    ${instance}    review-result
    ${discount}=    Get Variable    ${instance}    discountResult
    Should Be Equal As Integers    ${discount}    15

Business Rule Task With Silver Customer
    [Setup]    Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}business-rule-task.bpmn    ${CURDIR}${/}discount.dmn
    ${instance}=    Start Instance With Variables    business-rule-process    customerType=silver
    Should Have Task    ${instance}    review-result
    ${discount}=    Get Variable    ${instance}    discountResult
    Should Be Equal As Integers    ${discount}    10

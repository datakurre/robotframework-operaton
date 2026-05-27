*** Settings ***
Library     Operaton
Library     Collections


*** Test Cases ***
Submit Task Form With Named Arguments
    [Documentation]    Verifies that Submit Task Form accepts named keyword arguments and
    ...    passes them to the engine without error. Exercises the json, date, and number
    ...    form field types, plus the noop 'type' validator on the amount field.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}form-fields-process.bpmn
    Start Instance    form-fields-process
    Should Have Task    data-entry-task
    Submit Task Form    data-entry-task
    ...    jsonData={"key": "value"}
    ...    startDate=
    ...    amount=42
    [Teardown]    Teardown Process Engine

Get Task Form Variables Returns Field Map
    [Documentation]    Verifies that Get Task Form Variables returns a dict whose keys
    ...    match the declared form field IDs.
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}form-fields-process.bpmn
    Start Instance    form-fields-process
    Should Have Task    data-entry-task
    ${vars}=    Get Task Form Variables    data-entry-task
    Dictionary Should Contain Key    ${vars}    jsonData
    Dictionary Should Contain Key    ${vars}    startDate
    Dictionary Should Contain Key    ${vars}    amount
    [Teardown]    Teardown Process Engine

Submit Task Form With Decimal Amount
    [Documentation]    Verifies that VasaraNumberFormType handles decimal string values.
    ...    Only meaningful when running from the vasara fat JAR; passes without error
    ...    against the standard JAR too (engine falls back to built-in long type).
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}form-fields-process.bpmn
    Start Instance    form-fields-process
    Submit Task Form    data-entry-task
    ...    jsonData=null
    ...    startDate=
    ...    amount=3
    [Teardown]    Teardown Process Engine

Noop Validator Accepts Any String For Constrained Field
    [Documentation]    Verifies that the 'type' form field validator (VasaraFormValidatorNoop)
    ...    does not block form submission when the Vasara JAR is active. With the standard
    ...    JAR the 'type' constraint is also accepted (no built-in validator registered for it).
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}form-fields-process.bpmn
    Start Instance    form-fields-process
    Submit Task Form    data-entry-task
    ...    jsonData=null
    ...    startDate=
    ...    amount=99
    [Teardown]    Teardown Process Engine

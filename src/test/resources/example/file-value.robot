*** Settings ***
Library     Operaton


*** Test Cases ***
Test Pdf File Value
    [Documentation]    Tests that the pdf file value is correctly passed through the external task process
    [Setup]    Setup Process Engine
    Deploy Resources    ${CURDIR}${/}file-value.bpmn
    Start Instance    Process_1

    Set Process Variable    nimeamispyynto_nimi    testi

    ${file}=    Create File Variable
    ...    default_filename=nimeamispyynto.pdf
    ...    default_mime_type=application/pdf
    Execute Jobs Until Wait State    wait_for=external_task    topic=pdf.form.fill
    Complete External Task For Topic    topic=pdf.form.fill    output=${file}

    ${file}=    Create File Variable
    ...    default_filename=nimeamispyynto.pdf
    ...    default_mime_type=application/pdf
    Complete External Task For Topic    topic=pdf.pdfa.convert    output=${file}

    Should Be Ended
    [Teardown]    Teardown Process Engine

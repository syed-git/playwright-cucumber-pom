Feature: Verify Error Messages on Policy Info Screen

    @PolicyInfo @ErrorMessages @regression
    Scenario: Verify one insured is required to be added on Policy Info screen
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        And user clicks on 'nextButton'
        Then user expects to see message 'Please add at least one insured before continuing'
        And user logs out from policy center

    @PolicyInfo @ErrorMessages @regression
    Scenario: Verify the error messages if any of the mandatory field is missing
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        And user clicks on 'addInsuredButton'
        When user clicks on 'saveInsuredButton'
        Then user expects to see message 'First name is required'
        Then user expects to see message 'Last name is required'
        Then user expects to see message 'Date of birth is required'
        Then user expects to see message 'Gender is required'
        And user logs out from policy center

    @PolicyInfo @ErrorMessages @regression
    Scenario: Verify the first and last name accept only alphabets and spaces
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        And user clicks on 'addInsuredButton'
        And user fills 'First Name' with 'John123'
        And user fills 'Last Name' with 'Doe@456'
        When user clicks on 'saveInsuredButton'
        Then user expects to see message 'First name may contain only letters and spaces'
        Then user expects to see message 'Last name may contain only letters and spaces'
        And user logs out from policy center

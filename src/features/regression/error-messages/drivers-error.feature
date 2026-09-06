Feature: Verify Error Messages on Drivers Screen

    @Drivers @ErrorMessages @regression @demo
    Scenario: Verify one driver is required to be added on Drivers screen
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Drivers' page
        And user clicks on 'nextButton'
        Then user expects to see message 'Please add at least one driver'
        # And user logs out from policy center

    @Drivers @ErrorMessages @regression
    Scenario: Verify the error messages if any of the mandatory field is missing on Drivers screen
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Drivers' page
        And user clicks on 'addDriver'
        When user clicks on 'saveDriverButton'
        Then user expects to see message 'First name is required'
        Then user expects to see message 'Last name is required'
        Then user expects to see message 'Date of birth is required'
        Then user expects to see message 'Gender is required'
        Then user expects to see message 'Relationship to Insured is required'
        Then user expects to see message 'License Number is required'
        Then user expects to see message 'License State is required'
        Then user expects to see message 'License number is required'
        And user logs out from policy center

    @Drivers @ErrorMessages @regression
    Scenario: Verify the first and last name accept only alphabets and spaces
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Drivers' page
        And user clicks on 'addDriver'
        And user fills 'First Name' with 'John123'
        And user fills 'Last Name' with 'Doe@456'
        When user clicks on 'saveDriverButton'
        Then user expects to see message 'First name may contain only letters and spaces'
        Then user expects to see message 'Last name may contain only letters and spaces'
        And user logs out from policy center

    @Drivers @ErrorMessages @regression
    Scenario: Verify the license number accepts only 10 nuumbers
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Drivers' page
        And user clicks on 'addDriver'
        And user fills 'License Number' with 'anchdhd'
        And user clicks on 'saveDriverButton'
        Then user expects to see message 'License number must be exactly 10 digits'
        And user fills 'License Number' with '12345678'
        And user clicks on 'saveDriverButton'
        Then user expects to see message 'License number must be exactly 10 digits'
        Then user expects to see message 'Last name may contain only letters and spaces'
        And user logs out from policy center        

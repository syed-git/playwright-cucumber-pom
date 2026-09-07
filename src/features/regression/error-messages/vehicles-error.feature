Feature: Verify Error Messages on Vehicles Screen

    @Vehicles @ErrorMessages @regression
    Scenario: Verify one vehicle is required to be added on Vehicles screen
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Vehicles' page
        And user clicks on 'nextButton'
        Then user expects to see message 'Please add at least one vehicle'
        And user logs out from policy center

    @Vehicles @ErrorMessages @regression
    Scenario: Verify the error messages if any of the mandatory field is missing on Vehicles screen
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Vehicles' page
        And user clicks on 'addVehicle'
        When user clicks on 'saveVehicleButton'
        Then user expects to see message 'VIN is required'
        Then user expects to see message 'Year is required'
        Then user expects to see message 'Make is required'
        Then user expects to see message 'Model is required'
        Then user expects to see message 'Ownership is required'
        And user logs out from policy center

    @Vehicles @ErrorMessages @regression
    Scenario: Verify VIN accepts 15 alphanumeric only and should start with VIN
        Given user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        When user fills out data from 'Policy Info' to 'Vehicles' page
        And user clicks on 'addVehicle'
        And user fills 'VIN' with 'UGSHNG765243GH7'
        When user clicks on 'saveVehicleButton'
        Then user expects to see message 'VIN must be 15 alphanumeric characters starting with VIN (e.g. VINABC123456789)'
        And user logs out from policy center

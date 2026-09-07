Feature: Policy Change

    @PolicyChange @AddNewDriver @smoke
    Scenario: Add a new driver during policy change
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 5 days
        Given user sets 'numberOfDrivers' to '1'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user navigates from 'Policy Info' to 'Drivers' page
        And user fills the 'Drivers' page
        Then user navigates from 'Drivers' to 'View Full Policy' page
        Then user logs out from policy center
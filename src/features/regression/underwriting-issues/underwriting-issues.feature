Feature: Underwriting Issues

    @NewSubmission @UnderwritingIssues @regression @Violations
    Scenario: Verify underwriting issue is created for more than 4 violations
        Given user sets 'numberOfDrivers' to '2'
        Given user sets 'Drivers.Driver1.accidents' to '6'
        Given user sets 'Drivers.Driver1.violations' to '10'
        Given user sets 'Drivers.Driver1.relationshipToInsured' to 'Spouse'
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'Risk Analysis' page
        And user fills the 'Risk Analysis' page
        Then user logs out from policy center
        When 'underwriter' logs in to policy center
        And user searches the 'submission' number
        And user approves all the underwriting issues
        Then user logs out from policy center
        When 'accountExecutive' logs in to policy center
        And user searches the 'submission' number
        Then user navigates from 'Risk Analysis' to 'View Full Policy' page
        And user logs out from policy center
Feature: Underwriting Issues

    @NewSubmission @UnderwritingIssues @regression @Violations
    Scenario: Verify underwriting issue is created for 4 or more than 4 violations
        Given user sets 'numberOfDrivers' to '2'
        Given user sets 'Drivers.Driver1.violations' to '4'
        Given user sets 'Drivers.Driver1.relationshipToInsured' to 'Parent'
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

    @NewSubmission @UnderwritingIssues @regression @Accidents
    Scenario: Verify underwriting issue is created for 4 or more than 4 accidents
        Given user sets 'numberOfDrivers' to '2'
        Given user sets 'Drivers.Driver1.accidents' to '4'
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

    @NewSubmission @UnderwritingIssues @regression @Accidents @Violations
    Scenario: Verify underwriting issue is created for 4 or more than 4 combined accidents & violations
        Given user sets 'Drivers.Driver1.accidents' to '2'
        Given user sets 'Drivers.Driver1.violations' to '2'
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
    
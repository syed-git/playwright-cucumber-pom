Feature: Adding Insured

    @PolicyChange @AddInsured @regression
    Scenario: Verify multiple insured can be added during policy change
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 5 days
        Given user sets 'numberOfInsureds' to '2'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user fills out data from 'Policy Info' to 'Drivers' page
        Then user navigates from 'Drivers' to 'View Full Policy' page
        Then user logs out from policy center
    
    @PolicyChange @AddInsured @InsuredOptionalFields @regression
    Scenario: Verify a new insured can be added during policy change with all optional fields
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 10 days
        Given user sets 'numberOfInsured' to '1'
        Given user sets 'Insured.NamedInsured1.firstName' to 'Lily'
        Given user sets 'Insured.NamedInsured1.lastName' to 'Potter'
        Given user sets 'Insured.NamedInsured1.dateOfBirth' to '1990-01-01'
        Given user sets 'Insured.NamedInsured1.gender' to 'Female'
        Given user sets 'Insured.NamedInsured1.email' to 'lily.potter@example.com'
        Given user sets 'Insured.NamedInsured1.phone' to '4537733'
        Given user sets 'Insured.NamedInsured1.address' to 'Papini 227'
        Given user sets 'Insured.NamedInsured1.city' to 'New York'
        Given user sets 'Insured.NamedInsured1.state' to 'New York'
        Given user sets 'Insured.NamedInsured1.zip' to '25027'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user fills out data from 'Policy Info' to 'Drivers' page
        Then user navigates from 'Drivers' to 'View Full Policy' page
        Then user logs out from policy center

    @PolicyChange @RemoveInsured @regression
    Scenario: Verify a existing insured can be removed during policy change
        Given user sets 'numberOfInsured' to '2'
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        And user initiates the policy change
        Then user requests the graystoneData
        And user removes insured 2
        Then user navigates from 'Policy Info' to 'View Full Policy' page
        Then user logs out from policy center

    
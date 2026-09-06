Feature: Adding/Removing Drivers

    @PolicyChange @AddDriver @regression
    Scenario: Verify multiple drivers can be added during policy change
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 5 days
        Given user sets 'numberOfDrivers' to '2'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user fills out data from 'Policy Info' to 'Vehicles' page
        Then user navigates from 'Vehicles' to 'View Full Policy' page
        Then user logs out from policy center

    @PolicyChange @AddDriver @DriverOptionalFields @regression
    Scenario: Verify a new driver can be added during policy change with all optional fields
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 10 days
        Given user sets 'numberOfDrivers' to '1'
        Given user sets 'Drivers.Driver1.firstName' to 'James'
        Given user sets 'Drivers.Driver1.lastName' to 'Potter'
        Given user sets 'Drivers.Driver1.dateOfBirth' to '1989-01-01'
        Given user sets 'Drivers.Driver1.gender' to 'Female'
        Given user sets 'Drivers.Driver1.licenseNumber' to '9876756789'
        Given user sets 'Drivers.Driver1.licenseState' to 'NY'
        Given user sets 'Drivers.Driver1.yearsLicensed' to '5'
        Given user sets 'Drivers.Driver1.accidents' to '2'
        Given user sets 'Drivers.Driver1.violations' to '1'
        Given user sets 'Drivers.Driver1.relationshipToInsured' to 'Spouse'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user fills out data from 'Policy Info' to 'Vehicles' page
        Then user navigates from 'Vehicles' to 'View Full Policy' page
        Then user logs out from policy center

    @PolicyChange @RemoveDriver @regression
    Scenario: Verify a existing driver can be removed during policy change
        Given user sets 'numberOfDrivers' to '2'
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        And user initiates the policy change
        Then user navigates from 'Policy Info' to 'Drivers' page
        And user removes driver 2
        Then user navigates from 'Drivers' to 'View Full Policy' page
        Then user logs out from policy center

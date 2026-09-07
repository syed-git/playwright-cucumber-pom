Feature: Adding/Removing Vehicles

    @PolicyChange @AddVehicle @regression
    Scenario: Verify multiple vehicles can be added during policy change
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 5 days
        Given user sets 'numberOfVehicles' to '2'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user fills out data from 'Policy Info' to 'Coverages' page
        Then user navigates from 'Coverages' to 'View Full Policy' page
        Then user logs out from policy center

    @PolicyChange @AddVehicle @VehiclesOptionalFields @regression
    Scenario: Verify a new driver can be added during policy change with all optional fields
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        Given user sets 'effectiveDate' to future 10 days
        Given user sets 'numberOfVehicles' to '2'
        Given user sets 'Vehicles.Vehicle1.vin' to 'VIN56345GHYUH7G'
        Given user sets 'Vehicles.Vehicle1.year' to '2020'
        Given user sets 'Vehicles.Vehicle1.make' to 'Toyota'
        Given user sets 'Vehicles.Vehicle1.model' to 'Camry'
        Given user sets 'Vehicles.Vehicle1.ownership' to 'Rented'
        Given user sets 'Vehicles.Vehicle1.usage' to 'Pleasure'
        Given user sets 'Vehicles.Vehicle1.annualMileage' to '57383'
        Given user sets 'Vehicles.Vehicle1.costNew' to '56888'
        Given user sets 'Vehicles.Vehicle1.primaryDriver' to '1'
        Then user requests the graystoneData
        And user initiates the policy change
        Then user fills out data from 'Policy Info' to 'Coverages' page
        Then user navigates from 'Coverages' to 'View Full Policy' page
        Then user logs out from policy center

    @PolicyChange @RemoveVehicle @regression
    Scenario: Verify a existing vehicle can be removed during policy change
        Given user sets 'numberOfVehicles' to '2'
        Then user requests the graystoneData
        When 'accountExecutive' logs in to policy center
        When user initiates a new submission
        Then user fills out data from 'Policy Info' to 'View Full Policy' page
        And user initiates the policy change
        Then user navigates from 'Policy Info' to 'Vehicles' page
        And user removes vehicle 2
        Then user navigates from 'Vehicles' to 'View Full Policy' page
        Then user logs out from policy center

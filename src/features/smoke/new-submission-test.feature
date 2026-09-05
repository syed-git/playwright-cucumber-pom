Feature: Test Valid Login

  @NewSubmission @CurrentDated @smoke
  Scenario: Verify the current date new submisison with multiple insured, drivers and vehicles
    Given user sets 'numberOfInsured' to '2'
    Given user sets 'numberOfDrivers' to '2'
    Given user sets 'numberOfVehicles' to '2'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @BackDatedPolicy @smoke
  Scenario: Create a back dated new policy with 2 insured, 2 drivers, 2 vehciles
    Given user sets 'effectiveDate' to past 200 days
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'Risk Analysis' page
    And user fills the 'Risk Analysis' page
    And user logs out from policy center
    When 'underwriter' logs in to policy center
    And user searches the 'submission' number
    And user approves all the underwriting issues
    Then user logs out from policy center
    When 'accountExecutive' logs in to policy center
    And user searches the 'submission' number
    Then user navigates from 'Risk Analysis' to 'View Full Policy' page

  @NewSubmission @InsuredOptionalFields @smoke
  Scenario: Create a current dated new policy with optional details for insured
    Given user sets 'numberOfInsured' to '1'
    Given user sets 'Insured.NamedInsured1.firstName' to 'John'
    Given user sets 'Insured.NamedInsured1.lastName' to 'Wiliams'
    Given user sets 'Insured.NamedInsured1.dateOfBirth' to '1990-01-01'
    Given user sets 'Insured.NamedInsured1.gender' to 'Male'
    Given user sets 'Insured.NamedInsured1.email' to 'john.wiliams@example.com'
    Given user sets 'Insured.NamedInsured1.phone' to '4537733'
    Given user sets 'Insured.NamedInsured1.address' to 'Papini 227'
    Given user sets 'Insured.NamedInsured1.city' to 'New York'
    Given user sets 'Insured.NamedInsured1.state' to 'New York'
    Given user sets 'Insured.NamedInsured1.zip' to '25027'
    Given user sets 'Insured.NamedInsured1.isPrimaryInsured' to 'true'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @DriverOptionalFields @smoke
  Scenario: Create a current dated new policy with optional details for drivers
    Given user sets 'numberOfDrivers' to '1'
    Given user sets 'Drivers.Driver1.firstName' to 'Harry'
    Given user sets 'Drivers.Driver1.lastName' to 'Potter'
    Given user sets 'Drivers.Driver1.dateOfBirth' to '1989-01-01'
    Given user sets 'Drivers.Driver1.gender' to 'Male'
    Given user sets 'Drivers.Driver1.licenseNumber' to '9876756789'
    Given user sets 'Drivers.Driver1.licenseState' to 'NY'
    Given user sets 'Drivers.Driver1.yearsLicensed' to '5'
    Given user sets 'Drivers.Driver1.accidents' to '2'
    Given user sets 'Drivers.Driver1.violations' to '1'
    Given user sets 'Drivers.Driver1.relationshipToInsured' to 'Spouse'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @VehicleOptionalFields @smoke
  Scenario: Create a current dated new policy with optional details for vehicles
    Given user sets 'numberOfDrivers' to '2'
    Given user sets 'numberOfVehicles' to '1'
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
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @AllCoverages @smoke
  Scenario: Create a current dated new policy with all coverages
    Given user sets 'Coverages.bodilyInjuryLiability' to '50k/100k'
    Given user sets 'Coverages.propertyDamageLiability' to '50k'
    Given user sets 'Coverages.uninsuredMotorist' to '50k/100k'
    Given user sets 'Coverages.medicalPayments' to '10k'
    Given user sets 'Coverages.comprehensive' to '$250 ded'
    Given user sets 'Coverages.collision' to '$250 ded'
    Given user sets 'Coverages.rentalReimbursement' to '$50/day'
    Given user sets 'Coverages.roadSideAssitance' to 'Premium'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center
    

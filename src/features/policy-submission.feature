Feature: POlicy Submission

  @NewPolicy @currentDatePolicy @accountExecutive @smoke @build @regression
  Scenario: create a new policy submission
    Given user sets 'numberOfInsured' to '3'
    Given user sets 'numberOfDrivers' to '3'
    Given user sets 'numberOfVehicles' to '3'
    Given user sets 'Drivers.Driver1.gender' to 'Female'
    Given user sets 'Drivers.Driver2.gender' to 'Female'
    Given user sets 'Drivers.Driver2.licenseNumber' to '2789098765'
    Given user sets 'Vehicles.Vehicle3.ownership' to 'Leased'
    Given user sets 'Vehicles.Vehicle2.primaryDriver' to '2'
    Given user sets 'Vehicles.Vehicle2.usage' to 'Pleasure'
    Given user sets 'Coverages.medicalPayments' to '10,000'
    Given user sets 'Coverages.comprehensive' to '1000'
    Given user sets 'Coverages.roadSideAssitance' to 'Y'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user navigates from 'Policy Info' to 'View Full Policy' page

  @NewPolicy @BackDatedPolicy @Underwriter @smoke @regression
  Scenario: create a new 90 days back dated policy submission
    Given user sets 'effectiveDate' to '2026-04-04'
    Given user sets 'numberOfInsured' to '1'
    Given user sets 'numberOfDrivers' to '1'
    Given user sets 'numberOfVehicles' to '2'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user navigates from 'Policy Info' to 'Risk Analysis' page
    Then user fills the 'Risk Analysis' page
    And user logs out from policy center
    When 'underwriter' logs in to policy center
    And user approves all the underwriting issues
    And user logs out from policy center
    When 'accountExecutive' logs in to policy center
    When user navigates to 'Policies' tab
    When user retrieves the policy


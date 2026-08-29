Feature: Create new submission

  @NewSubmission @CurrentDate @build
  Scenario: Create a current dated new policy
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user navigates from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @BackDatedPolicy @build
  Scenario: Create a current dated new policy with 2 insured, 3 drivers, 2 vehciles
    Given user sets 'numberOfInsured' to '2'
    Given user sets 'numberOfDrivers' to '3'
    Given user sets 'numberOfVehicles' to '2'
    Given user sets 'Coverages.bodilyInjuryLiability' to '50,000/100,000'
    Given user sets 'Coverages.propertyDamageLiability' to '50,000'
    Given user sets 'Coverages.uninsuredMotorist' to '50,000/100,000'
    Given user sets 'Coverages.medicalPayments' to '1,000'
    Given user sets 'Coverages.comprehensive' to '250'
    Given user sets 'Coverages.collision' to '250'
    Given user sets 'Coverages.rentalReimbursement' to '30/day, 900 max'
    Given user sets 'Coverages.roadSideAssitance' to 'Y'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user navigates from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  # @NewSubmision @BackDatedPolicy @Underwriter @build @demo
  # Scenario: Create a current dated new policy with 2 insured, 3 drivers, 2 vehciles
  #   Given user sets 'effectiveDate' to past 100 days
  #   Given user sets 'numberOfInsured' to '2'
  #   Given user sets 'numberOfDrivers' to '2'
  #   Given user sets 'numberOfVehicles' to '2'
  #   Given user sets 'Coverages.bodilyInjuryLiability' to '50,000/100,000'
  #   Given user sets 'Coverages.propertyDamageLiability' to '50,000'
  #   Given user sets 'Coverages.uninsuredMotorist' to '50,000/100,000'
  #   Given user sets 'Coverages.medicalPayments' to '1,000'
  #   Given user sets 'Coverages.comprehensive' to '1000'
  #   Given user sets 'Coverages.collision' to '500'
  #   Given user sets 'Coverages.rentalReimbursement' to '30/day, 900 max'
  #   Given user sets 'Coverages.roadSideAssitance' to 'Y'
  #   Then user requests the graystoneData
  #   When 'accountExecutive' logs in to policy center
  #   When user initiates a new submission
  #   Then user navigates from 'Policy Info' to 'Risk Analysis' page
  #   And user logs out from policy center
  #   When 'underwriter' logs in to policy center
  #   And user approves all the underwriting issues
  #   And user logs out from policy center
  #   When 'accountExecutive' logs in to policy center
  #   When user navigates to 'Policies' tab
  #   When user retrieves the policy


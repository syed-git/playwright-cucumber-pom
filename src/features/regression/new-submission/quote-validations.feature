Feature: Verify quote

  @NewSubmission @QuoteValidations @regression @demo
  Scenario: Verify total premium is the sum of individual coverages amount
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
    Then user fills out data from 'Policy Info' to 'Quote' page
    Then verify total premium as sum of individual coverages
    And user logs out from policy center

Feature: Create new submission

  @NewSubmission @CurrentDate @build
  Scenario: Create a current dated new policy
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @BackDatedPolicy @build
  Scenario: Create a current dated new policy with 2 insured, 3 drivers, 2 vehciles
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
    

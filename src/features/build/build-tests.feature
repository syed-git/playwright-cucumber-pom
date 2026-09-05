Feature: Create new submission

  @NewSubmission @build
  Scenario: Create a current dated new policy
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @PolicyChange @build
  Scenario: Verify policy change functionality
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    Given user sets 'effectiveDate' to future 5 days
    Then user requests the graystoneData
    And user initiates the policy change
    Then user navigates from 'Policy Info' to 'View Full Policy' page
    Then user logs out from policy center

  @CancelPolicy @build
  Scenario: Verify policy cancel functionality
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user initiates 'Flat' policy cancellation
    Then user reinstate the policy
    Then user logs out from policy center
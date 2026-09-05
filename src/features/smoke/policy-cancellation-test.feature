Feature: Policy Cancellation

    @Cancellation @smoke @ProRata
    Scenario: Verify pro rate policy cancellation
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user initiates 'Pro-rata' policy cancellation
    Then user reinstate the policy
    Then user logs out from policy center
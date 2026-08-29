Feature: Create new policy

  @NewSubmission @CurrentDate @regression
  Scenario: Create a current dated new policy 3 vehicles
    Given user sets 'numberOfVehicles' to '3'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user navigates from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center
Feature: Create new submission

  @NewSubmission @FutureDatedPolicy @regression
  Scenario: Create a future dated new policy
    Given user sets 'effectiveDate' to future 10 days
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    And user logs out from policy center

  @NewSubmission @RelationshipToInsured @regression
  Scenario: Verify policy for a driver with relation to insured as 'Child'
    Given user sets 'effectiveDate' to future 10 days
    Given user sets 'Drivers.Driver1.relationshipToInsured' to 'Child'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    Then user logs out from policy center

  @NewSubmission @Onwership @regression
  Scenario: Verify policy with vehicle ownership as 'Leased' and usage as 'Pleasure'
    Given user sets 'Vehicles.Vehicle1.ownership' to 'Leased'
    Given user sets 'Vehicles.Vehicle1.usage' to 'Pleasure'
    Then user requests the graystoneData
    When 'accountExecutive' logs in to policy center
    When user initiates a new submission
    Then user fills out data from 'Policy Info' to 'View Full Policy' page
    Then user logs out from policy center
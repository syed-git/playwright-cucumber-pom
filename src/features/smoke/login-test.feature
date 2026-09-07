Feature: Test Valid Login

    @Login @AccountExecutive @smoke
    Scenario: Verify the account executive login
        When 'accountExecutive' logs in to policy center
        Then user logs out from policy center

    @Login @Underwriter @smoke
    Scenario: Verify the underwriter login
        When 'underwriter' logs in to policy center
        Then user logs out from policy center

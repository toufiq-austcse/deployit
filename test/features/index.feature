@Health-Check
Feature: Health Check
  In Order to check the health of the application
  As a developer
  I want make sure the application is healthy

  Scenario: Health Check
    When I send GET request to "/"
    Then I should get a 200 response code


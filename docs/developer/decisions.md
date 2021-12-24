
# Testing

  ## Verification
  - .
    In tests, I need to pass in file names, the question here is
    Should I verify, that a file exists (1) only in the test or (2) in the business logic?

    [DECISION] (1)
      - Reason: Not in tests, one would always only open file, that exist
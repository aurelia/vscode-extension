- [Debugging](#debugging)
  - [Run and Debug](#run-and-debug)
  - [Troubleshooting](#troubleshooting)
- [Testing](#testing)
  - [Assumptions](#assumptions)
    - [In tests, one does not need a .ts/.html file for the extension to active](#in-tests-one-does-not-need-a-tshtml-file-for-the-extension-to-active)
# Debugging

## Run and Debug

1. Select Run and Debug in VSCode
2. Select and run the launch task "Launch Client"
   1. Select a folder/workspace you want to debug
   2. [important] The extension only activates, when .ts/.html file is open
3. Select and run launch task "Attach Server"

## Troubleshooting

- When I click on "Launch Client" nothing happens
  - Reload VSCode and try again
- "Attach Server" results in Could not connect to debug target at http://localhost:6009:
  - Make sure to have step 2.2 in [Run and Debug](#run-and-debug)

# Testing

## Assumptions

### In tests, one does not need a .ts/.html file for the extension to active
Compare 2.2 in [Run and Debug](#run-and-debug).
In our BDD tests, "open VSCode" activates the extension
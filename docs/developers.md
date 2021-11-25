- [Debugging](#debugging)
  - [Run and Debug](#run-and-debug)
  - [Troubleshooting](#troubleshooting)
    - [Launch Client](#launch-client)
    - [Attach server](#attach-server)
- [Coding style](#coding-style)
  - [Prefer only one return in function with if/else/switch](#prefer-only-one-return-in-function-with-ifelseswitch)
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

### Launch Client
- When I click on "Launch Client" nothing happens
  - Reload VSCode and try again
- The terminal process "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -Command yarn run watch" terminated with exit code: 1.
  - change your default terminal (security issues with powershell, the default shell)
  - Recommendation: Bash

### Attach server
- "Attach Server" results in Could not connect to debug target at http://localhost:6009:
  - Make sure to have step 2.2 in [Run and Debug](#run-and-debug)

# Coding style

## Prefer only one return in function with if/else/switch
Reason: For logging, I then only have to log at the end of the function.

# Testing
(check dedicated testing.md file)

## Assumptions

### In tests, one does not need a .ts/.html file for the extension to active
Compare 2.2 in [Run and Debug](#run-and-debug).
In our BDD tests, "open VSCode" activates the extension

# Adding new features
With this doc, I'm trying to track how easy it is to add a new feature.
Thus, have a (subject) measure of how complex the extension architecture is.

## Adding diagnostics
- somewhere the parsing is happening
  - parsing <- init
    - aureliaServer.ts -> onConnectionInitialized
      - AureliaProjects
        - [hydrate](..\..\server\src\core\AureliaProjects.ts)
        - [addAureliaProgramToEachProject](..\..\server\src\core\AureliaProjects.ts)
- --> AureliaProgram
  - [initAureliaComponents]
    - AureliaComponents


## TODO
- Static analysis is part of core
  --> Should be split up
  - Goal of the "extension core" should not be handling aurelia related stuff

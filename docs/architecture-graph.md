```mermaid
flowchart TD
  AureliaServer --> AureliaProjects
  AureliaServer --> DocumentSettings
  AureliaProjects --> hydrateAureliaProjectList
  hydrateAureliaProjectList --> AureliaProgram

  AureliaServer

  DocumentSettings

  AureliaProjects
  hydrateAureliaProjectList

  AureliaProgram

```

---

```mermaid
sequenceDiagram
    autonumber
    participant AureliaServer
    participant AureliaProjects
    participant WatcherProgram
    participant AureliaProgram

    AureliaServer->>AureliaProjects: onConnectionInitialized

    loop For each project
      AureliaProjects ->> WatcherProgram: hydrateAureliaProjectList
    end
    WatcherProgram ->> WatcherProgram: createAureliaWatchProgram
    WatcherProgram ->> AureliaProgram: updateAureliaComponents
    AureliaProgram ->> AureliaProgram: setComponentList
    AureliaProgram ->> AureliaProjects: targetAureliaProject.aureliaProgram = aureliaProgram

    AureliaServer->>AureliaProjects: onContentChanged
```
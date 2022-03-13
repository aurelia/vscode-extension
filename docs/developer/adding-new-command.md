
# Adding a new Command

1. `package.json` [link](../../package.json)
   - `contributes.commands`
   ```json
   {
      "command": "extension.au.<commandName>",
      "title": "Command Name",
      "category": "Aurelia"
   }
   ```

2. `server.ts` [link](../../server/src/server.ts)
  - `connection.onExecuteCommand`

3. `constants.ts` [link](../../server/src/common/constants.ts)

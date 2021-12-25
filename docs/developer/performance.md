

## AureliaProgram
Want to reduce calls, because we want to reuse typechecker
Currently:
1. this.container.get()
2. new AureliaProgram() in AureliaProject.hydrate

## AureliaProject
- [ ] ~0.7s updateAureliaComponents


- [ ] ~0.25 parsing
  Perf:
     >> (6.) - onCompletion 0 <<
     >> (7.) - onCompletion 1 <<
     >> 0.2472254550009966 sec

## Ts-morph
- [ ] ~2s compilerObject = program.compilerObject;
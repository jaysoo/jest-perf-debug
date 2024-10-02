# Debugging `@nx/jest/plugin` performance


To infer targets from scratch, run:

```shell
nx reset
NX_DAEMON=false NX_CACHE_PROJECT_GRAPH=false nx show projects --verbose
```

This takes ~40s on my machine.

# Cosmic engine reference fixtures

`golden.json` was recorded from `src/components/generative/PatternCanvas/InfiniteGenerator.ts` at commit `5717aa3124c3a61ddb8ef4157e0c41a6a81976bf`, before extraction. Its UTF-8 source SHA-256 after CRLF-to-LF normalization is `15332733ededd452a3ef7c3f28ebb2db7d1dace768a603aaf7ea9541970993ee`.

Each scenario records Canvas command count/hash, serializable simulation state hash and seeded RNG draw count. Gradients get deterministic IDs; Canvas `save`/`restore` restores style properties. Nonfinite values are represented explicitly when hashing. This verifies call order and state, while browser pixel parity is checked separately during the refactor review.

To reproduce a fixture, retrieve the reference file from that commit, pass its text to `compileSource` from `loadSimulation.mjs`, then run every exported `scenarios` item through `runScenario` from `canvasTrace.mjs` with the reference constructor. Never regenerate reference fixtures from the refactored constructor. The old source is intentionally not duplicated in this repository.

Run `node --test tests/cosmicParity.test.mjs`. Tests deliberately exercise existing private simulation helpers separately; the public frame retains its previous omitted rendering/update calls and `pauseGeneration` remains the existing no-op. Internal collision adapters group coordinates and indices; the public constructor, `updateSettings` and `render` signatures/prototype remain unchanged.

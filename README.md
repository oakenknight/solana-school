# Solana School

<img src="./assets/60_days_of_solana_image.webp" alt="Solana 60 Days" height="180"><img src="./assets/blog_post_image_light-1.webp" alt="RareSkills" height="180">

## Following the RareSkills Solana tutorial: [RareSkills Solana tutorial](https://rareskills.io/solana-tutorial)

## Quick start
 
Prereqs: Node.js, Rust/Cargo, Solana CLI, Anchor CLI

Run tests for a day:

```bash
cd day_XX
anchor test
```

Build/deploy:

```bash
anchor build
anchor deploy                 # localnet
# or
anchor deploy --provider.cluster devnet
```

Start a local validator:

```bash
solana-test-validator -r
```

Each day folder contains an Anchor program under `programs/` and tests under `tests/`.

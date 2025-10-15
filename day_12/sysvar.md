# Solana Sysvars — Practical Lecture Notes

## Key concepts

- Sysvars are read-only system accounts exposing cluster/network state to programs (similar to EVM “globals”).
- In Anchor, there are two access patterns:
	- Convenience accessors: `Clock::get()`, `EpochSchedule::get()`, `Rent::get()`, etc.
	- As accounts: pass the sysvar’s public address in the instruction, then parse in-program.

## Slots vs blocks (the mental model)

- A slot is a short time window (~400 ms) where the scheduled leader can produce a block.
- Every block belongs to exactly one slot, but the “slot hash” and “block hash” are different values.
- Some slots may have no block if the leader misses it. Explorers show slot details and block details under different hashes.

Implication for developers: when you see “block number” analogies in EVM content, prefer “slot” on Solana; do not assume hashes match.

---

## Accessing sysvars with Anchor `get()`

The following sysvars have stable `get()` helpers in Anchor today.

### Clock

Purpose: time/epoch/slot context.

Fields you’ll commonly use (subset):

- `unix_timestamp: i64`
- `slot: u64`
- `epoch: u64`
- `leader_schedule_epoch: u64`
- `epoch_start_timestamp: i64`

How to use (no code):

- Use `Clock::get()` to read the current `slot`, `epoch`, and `unix_timestamp`.
- Apply for time-based access control, rate limiting, or slot-aware logic.
- Remember `unix_timestamp` is signed (`i64`).

Typical uses: time-based conditions, slot-aware logic, rate limiting, etc. Note `unix_timestamp` is `i64`.

### EpochSchedule

Purpose: epoch sizing and scheduling parameters.

Key fields:

- `slots_per_epoch: u64`
- `leader_schedule_slot_offset: u64`
- `warmup: bool`
- `first_normal_epoch: u64`
- `first_normal_slot: u64`

How to use (no code):

- Call `EpochSchedule::get()` to retrieve epoch configuration values.
- Use `slots_per_epoch` and `leader_schedule_slot_offset` to reason about leader rotation and epoch boundaries.
- Expect `first_normal_epoch` and `first_normal_slot` to be 0 on a fresh local validator.

Notes:

- On a fresh local validator, “first normal” values often read as 0 — that’s expected.

### Rent

Purpose: rent rates and rent-exemption calculations.

Common fields:

- `lamports_per_byte_year: u64`
- `exemption_threshold: f64`
- `burn_percent: u8`

How to use (no code):

- Call `Rent::get()` and use `minimum_balance(len)` for rent-exemption checks.
- Avoid hand-rolled rent formulas; rely on the helper for correctness.

Practical tip: prefer the provided `minimum_balance(len)` helper over hand-rolled formulas.

---

## Accessing sysvars by public address (as accounts)

Use this when Anchor does not expose a `get()` helper or when the sysvar is only available as an account.

Accounts wiring (no code):

- Add the required sysvar accounts to your instruction’s account context as read-only, non-signer accounts.
- Pass the sysvar public keys from the client when invoking the instruction.

Then parse it in the instruction using the relevant helper.

### StakeHistory

Purpose: record of stake activations/deactivations by epoch (network-wide).

How to read (no code):

- Pass `SYSVAR_STAKE_HISTORY_PUBKEY` as a read-only account.
- In the program, parse the account data using the corresponding `StakeHistory` parser.
- Expect empty/sparse data on local validators.

Notes:

- On a local validator, this often returns empty data — that’s normal in small local chains.
- Typescript constant: `anchor.web3.SYSVAR_STAKE_HISTORY_PUBKEY`.

### Instructions (a.k.a. Instruction sysvar)

Purpose: read the serialized instructions of the current transaction and related metadata.

How to read (no code):

- Pass `SYSVAR_INSTRUCTIONS_PUBKEY` as a read-only account.
- In the program, load the desired instruction by index from the Instruction sysvar.
- Use this to inspect program IDs, account metas, and serialized data for the current transaction.

Typescript constant for tests: `anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY`.

### LastRestartSlot (exercise-level)

Purpose: exposes the slot at which the network last restarted (or 0 if never).

Notes:

- Anchor may not provide a typed helper or constant for this sysvar in some versions.
- You can still pass its public key as an account and parse the data. Treat as a simple value source (u64) or use the appropriate Solana `sysvar::last_restart_slot` type if available in your toolchain.

---

## Deprecated and unsupported sysvars (Anchor context)

- Deprecated (do not rely on):
	- `RecentBlockhashes`
	- `Fees`

- Not accessible via Anchor in current versions (attempting may error):
	- `EpochRewards`
	- `SlotHistory`
	- `SlotHashes`

Always check your Anchor and Solana program crate versions; availability may change.

---

## Putting it together — minimal client wiring (no code)

- In your client, pass `anchor.web3.SYSVAR_STAKE_HISTORY_PUBKEY` and `anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY` to the `.accounts({...})` of the instruction call.
- Submit the transaction and check program logs for parsed sysvar data.

---

## Common pitfalls and tips

- Localnet emptiness: many network-wide sysvars (e.g., `StakeHistory`) are sparse or empty on local validators — mock or switch to devnet/mainnet when validating logic.
- `i64` timestamps: `Clock.unix_timestamp` is signed; cast carefully if your app uses unsigned types.
- Prefer helpers: use `Rent::minimum_balance(len)` instead of re-deriving formulas.
- Pass the right accounts: when reading sysvars by address, ensure the account metas match what your program expects (read-only, not signer).
- Deprecations drift: `RecentBlockhashes`/`Fees` are historical; don’t build new features around them.


---

## Reference

- RareSkills: Solana Sysvars Explained — [rareskills.io/post/solana-sysvar](https://rareskills.io/post/solana-sysvar)
- Solana Program Library (sysvars) — [docs.solana.com/developing/programming-model/sysvars](https://docs.solana.com/developing/programming-model/sysvars)
- Anchor Book — [anchor-lang.com](https://www.anchor-lang.com/)


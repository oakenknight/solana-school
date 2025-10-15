# EVM Block Variables vs Solana Equivalents

## Overview & Motivation

In Solidity/EVM, contracts often refer to various block-related variables:

- `block.timestamp`
- `block.number`
- `blockhash(...)`
- `block.coinbase`
- `block.basefee`
- `block.difficulty`
- `block.chainid`

On Solana, there is **no 1:1 mapping** for all of these. Some have analogs (called "sysvars"), some are absent, and some are deprecated.

This document maps these EVM-style block variables to their Solana equivalents (or notes their absence).

## Key Solana "Block" Fields / Sysvars & Their Semantics

Below is a comprehensive mapping of EVM block variables to Solana constructs, based on RareSkills documentation:

### EVM Block Variable Mappings

| EVM Block Variable | Solana Equivalent | Notes & Limitations |
|-------------------|------------------|-------------------|
| `block.timestamp` | `Clock.unix_timestamp` (via Clock sysvar) | **Accessible** in Solana programs via the Clock sysvar. Type is `i64`, not `u64` (allows negative values, though time is never actually negative). Reflects a Unix timestamp (seconds since epoch). *Source: RareSkills* |
| `block.number` | Solana slot number | Solana has the notion of **slots**, which are time intervals in which a block proposer (leader) may propose a block. Slot ≈ block number, though they are distinct concepts. *Source: RareSkills* |
| `block.coinbase` | Leader / Block proposer (**no direct access**) | In Ethereum, coinbase is the miner's address (who receives block reward). In Solana, blocks are produced by scheduled leaders (through Proof of History + Proof of Stake). **No direct way** for a Solana program to access the leader's address like `block.coinbase`. *Source: RareSkills* |
| `blockhash` / `blockhash(...)` | `RecentBlockhashes` sysvar (**deprecated**) | Solana used to provide a `RecentBlockhashes` sysvar containing recent block hashes and fee calculators. **This sysvar is deprecated** ⚠️. Access pattern: using `from_account_info` (since there's no get-style API). *Source: RareSkills* |
| `block.gaslimit` | "Compute unit" limit per block | Solana limits compute per block globally: **~48 million compute units**. Individual transactions have a default limit (200,000 compute units), though that can sometimes be raised higher (e.g., 1.4 million) under certain conditions. This per-block compute cap is **not programmatically exposed**. *Source: RareSkills* |
| `block.basefee` | **Not applicable** / static pricing | In Ethereum (EIP-1559 model), basefee is dynamic, depending on block utilization. In Solana, transaction pricing is **static** (no dynamic "base fee"). *Source: RareSkills* |
| `block.difficulty` / `block.prevrandao` | **Not applicable** | These are PoW / randomness / consensus-specific fields in Ethereum. Solana's consensus model (PoH + PoS) does not have the concept of "difficulty". *Source: RareSkills* |
| `block.chainid` | **No direct equivalent** | In EVM, chainid lets contracts detect the chain (e.g., testnet vs mainnet). Solana does not embed a chainid in the same way. Solana clusters (Devnet, Testnet, Mainnet) are separate, but programs don't have a built-in chain identifier accessible. *Source: RareSkills* |

## Additional Comments & Caveats

> ⚠️ **Important Considerations**

- **Deprecated sysvars**: Some sysvars (like `RecentBlockhashes`) are deprecated, so relying on them is discouraged for future compatibility.

- **Missing fields**: Because some "block" fields are simply not exposed in Solana programs (e.g., leader address, dynamic base fee), smart contract logic should avoid expecting those analogs to exist.

- **Different paradigm**: The Solana model emphasizes **slots** and **sysvars** (like `Clock`) rather than a fully featured block header accessible inside programs.

- **Architecture differences**: Certain EVM-style fields (especially mining/proof-of-work ones) don't map over meaningfully in Solana's architecture.

---

*This documentation is based on research from [RareSkills](https://www.rareskills.io/) and other Solana development resources.*

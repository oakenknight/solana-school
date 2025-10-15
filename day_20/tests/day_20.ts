import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day20 } from "../target/types/day_20";

describe("day_20", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day20 as Program<Day20>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
  it("Is initialized2!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize2().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Is increased!", async () => {
    // Add your test here.
    const tx = await program.methods.increaseAccountSize().rpc();
    console.log("Your transaction signature", tx);
  });
});

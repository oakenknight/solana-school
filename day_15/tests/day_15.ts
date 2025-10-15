import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day15 } from "../target/types/day_15";

describe("day_15", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day15 as Program<Day15>;
  const defaultAccount = new anchor.web3.PublicKey("HyysbQxjzw841JKFi1PVDbFFhs9XPAGnraRGvQDNaeg8");
  it("Is initialized!", async () => {
    // Add your test here.
    let bal_before = await program.provider.connection.getBalance(defaultAccount);
    console.log("Balance before:", bal_before);
    const tx = await program.methods.initialize().rpc();
    
    let bal_after = await program.provider.connection.getBalance(defaultAccount);
    console.log("Balance after:", bal_after);
    // log the difference
    console.log(
      "diff:",
      BigInt(bal_before.toString()) - BigInt(bal_after.toString())
    ); //n at the end is for BigInt
  });
});

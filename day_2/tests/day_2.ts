import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day2 } from "../target/types/day_2";

describe("day_2", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day2 as Program<Day2>;

  it("Hello, Solana!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize(new anchor.BN(777), new anchor.BN(888), "Hello from the other side").rpc();
    console.log("Your transaction signature", tx);
  });
  // added this test
  it("Array test", async () => {
    const tx = await program.methods.array([new anchor.BN(777), new anchor.BN(888)]).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Overflow test", async () => { //-> if overflow check is true this fails
    const tx = await program.methods.overflow(new anchor.BN(0), new anchor.BN(1)).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Checked Overflow test", async () => { 
    const tx = await program.methods.checkedOverflow(new anchor.BN(0), new anchor.BN(1)).rpc();
    console.log("Your transaction signature", tx);
  });
  it("Powers test", async () => {
    const tx = await program.methods.powers(new anchor.BN(2), 3).rpc();
    console.log("Your transaction signature", tx);
  });
  it("Cbrt test", async () => {
    const tx = await program.methods.croot(50).rpc();
    console.log("Your transaction signature", tx);
  });
});

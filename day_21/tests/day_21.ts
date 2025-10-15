import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day21 } from "../target/types/day_21";

describe("day_21", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day21 as Program<Day21>;

  let pubkey = new anchor.web3.PublicKey("B5gVjut8vxSPDZxWSNj3pXuaLCH6FXCsLkWNXtddBCjg");


  it("Tests the balance", async () => {
    const tx = await program.methods.readBalance().accounts({ acct: pubkey }).rpc();
  });
});

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ReinitAttack } from "../target/types/reinit_attack";

describe("reinit_attack", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.reinitAttack as Program<ReinitAttack>;

it("initialize after giving to system program or draining lamports", async () => {
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

    
    /*
      We initialize the PDA
      We transfer ownership of the PDA to the system program
      We call initialize again, and it succeeds
      We empty the lamports from the my_pda account
      With zero lamport balance, the Solana runtime considers the account non-existent as it will be scheduled for deletion as it is no longer rent exempt.
      We call initialize again, and it succeeds.We have successfully reinitialized the account after following this sequence.
    */
  
    await program.methods.initialize().accounts({myPda: myPda}).rpc();

    await program.methods.giveToSystemProgram().accounts({myPda: myPda}).rpc();

    await program.methods.initialize().accounts({myPda: myPda}).rpc();
    console.log("account initialized after giving to system program!")

    await program.methods.drainLamports().accounts({myPda: myPda}).rpc();

    await program.methods.initialize().accounts({myPda: myPda}).rpc();
    console.log("account initialized after draining lamports!")
  });

  it("test erase", async () => { //t will fail because even though the account has no data, it is still owned by the program and has a non-zero lamport balance.
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

    await program.methods.initialize().accounts({myPda: myPda}).rpc();
    await program.methods.erase().accounts({myPda: myPda}).rpc();
    await program.methods.initialize().accounts({myPda: myPda}).rpc();
  });
});

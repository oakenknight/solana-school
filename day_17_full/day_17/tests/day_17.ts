import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day17 } from "../target/types/day_17";

describe("day_17", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day17 as Program<Day17>;

  it("Is initialized!", async () => {
    const seeds = [];
    const [my_storage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
    
    console.log("the storage account address is", my_storage.toBase58());

    const tx = await program.methods.initialize()
    .accounts({
      myStorage: my_storage,
    })
    .rpc();
    console.log("Your transaction signature", tx);

    await program.methods
      .set(new anchor.BN(5), new anchor.BN(10), new anchor.BN(15))
      .accounts({ myStorage: my_storage })
      .rpc();

    await program.methods.printX().accounts({myStorage: my_storage}).rpc();

  });

});

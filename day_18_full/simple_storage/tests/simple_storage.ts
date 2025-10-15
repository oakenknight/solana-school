import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SimpleStorage } from "../target/types/simple_storage";

describe("simple_storage", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.simpleStorage as Program<SimpleStorage>;

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
  
      let storage = await program.account.myStorage.fetch(my_storage);
      console.log("The x value is", storage.x.toString());
      console.log("The y value is", storage.y.toString());
      console.log("The z value is", storage.z.toString());
  });
});

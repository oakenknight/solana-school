import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.counter as Program<Counter>;

  it("Is initialized!", async () => {
    const seeds = [];
    const [my_storage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
    
    console.log("the storage account address is", my_storage.toBase58());

    const tx = await program.methods.initialize().accounts({
      storage: my_storage,
    }).rpc();

    await program.methods.increment().accounts({storage: my_storage}).rpc();

    await program.methods.printCounter().accounts({storage: my_storage}).rpc();
    console.log("Your transaction signature", tx);
  });


  for (let i = 0; i < 10; i++) {
    it(`Increment number ${i + 1}`, async () => {
      const seeds = [];
      const [my_storage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
      
      console.log("the storage account address is", my_storage.toBase58());
  
      await program.methods.increment().accounts({storage: my_storage}).rpc();
  
      await program.methods.printCounter().accounts({storage: my_storage}).rpc();
    });
  }
});

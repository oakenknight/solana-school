import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day19 } from "../target/types/day_19";

describe("day_19", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day19 as Program<Day19>;

  it("Is initialized!", async () => {
  const whichMap = new anchor.BN(1); // namespace to distinguish first mapping
    const whichMap2 = new anchor.BN(2); // namespace to distinguish first mapping

  const key1 = new anchor.BN(42);
  const seeds = [whichMap.toArrayLike(Buffer, "le", 8), key1.toArrayLike(Buffer, "le", 8)];
  const seeds2 = [whichMap2.toArrayLike(Buffer, "le", 8), key1.toArrayLike(Buffer, "le", 8)];

    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId)[0];
    let valueAccount2 = anchor.web3.PublicKey.findProgramAddressSync(seeds2, program.programId)[0];

    // Add your test here.
    const tx = await program.methods
      .initialize(whichMap, key1)
      .accounts({
        val: valueAccount,
      })
      .rpc();
    const tx2 = await program.methods
      .initialize(whichMap2, key1)
      .accounts({
        val: valueAccount2,
      })
      .rpc();

    
    await program.methods
      .set(whichMap, key1, new anchor.BN(123))
      .accounts({ val: valueAccount })
      .rpc();
    
    await program.methods
      .set(whichMap2, key1, new anchor.BN(125))
      .accounts({ val: valueAccount2 })
      .rpc();
    
      let res = await program.account.val.fetch(valueAccount);
    
     console.log(`the value ${res.value} was stored in ${valueAccount.toBase58()}`);


    let res2 = await program.account.val.fetch(valueAccount2);
    
     console.log(`the value ${res2.value} was stored in ${valueAccount2.toBase58()}`);
  });

  it("Is initialized 2!", async () => {
    const key1 = new anchor.BN(1);
    const key2 = new anchor.BN(2);
    const seeds = [key1.toArrayLike(Buffer, "le", 8), key2.toArrayLike(Buffer, "le", 8)];

    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId)[0];
    
    // Add your test here.
    const tx = await program.methods
      .initialize2(key1, key2)
      .accounts({
        val2: valueAccount,
      })
      .rpc();

    await program.methods
      .set2(key1, key2, new anchor.BN(456))
      .accounts({ val2: valueAccount })
      .rpc();

    let res = await program.account.val2.fetch(valueAccount);
    
     console.log(`the value ${res.value} was stored in ${valueAccount.toBase58()}`);
  });
});

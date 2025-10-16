import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChangeOwner } from "../target/types/change_owner";
import privateKey from '/Users/aleksandar/.config/solana/id.json';

describe("change_owner", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ChangeOwner as Program<ChangeOwner>;

  it("Is initialized!", async () => {
    const deployer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(privateKey));

    const seeds = []
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    console.log("the storage account address is", myStorage.toBase58());

    await program.methods.initialize().accounts({myStorage: myStorage}).rpc();
    await program.methods.changeOwner().accounts({myStorage: myStorage}).rpc();
    
    // after the ownership has been transferred
    // the account can still be initialized again
    await program.methods.initialize().accounts({myStorage: myStorage}).rpc();
  });
});

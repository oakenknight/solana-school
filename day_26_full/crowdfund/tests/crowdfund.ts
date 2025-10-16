import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Crowdfund } from "../target/types/crowdfund";
async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount * anchor.web3.LAMPORTS_PER_SOL);
  await confirmTransaction(airdropTx);
}

async function confirmTransaction(tx) {
  const latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}
describe("crowdfund", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.crowdfund as Program<Crowdfund>;

  it("Is initialized!", async () => {
    const programId = await program.account.pda.programId;

    let seeds = [];
    let pdaAccount = anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)[0];

    const tx = await program.methods.initialize().accounts({
      pda: pdaAccount
    }).rpc();

    // transfer 2 SOL
    const tx2 = await program.methods.donate(new anchor.BN(3_000_000_000)).accounts({
      pda: pdaAccount
    }).rpc();

    console.log("lamport balance of pdaAccount",
    await anchor.getProvider().connection.getBalance(pdaAccount));

    // transfer back 1 SOL
    // the signer is the permitted address
    await program.methods.withdraw(new anchor.BN(1_000_000_000)).accounts({
      pda: pdaAccount
    }).rpc();

    // EXPLOIT: attacker drains the PDA
    const attacker = anchor.web3.Keypair.generate();
    
    // Fund attacker with rent
    await airdropSol(attacker.publicKey, 1); // 1 SOL
   
    console.log("owner of keypair after airdrop:",
    (await anchor.getProvider().connection.getAccountInfo(attacker.publicKey)).owner.toBase58());
    // Attacker withdraws 1 SOL (no authorization check!)
    console.log("This should result in error because there is hardcoded address in signers check");
    try{
      await program.methods.withdraw(new anchor.BN(1_000_000_000)).accounts({
        pda: pdaAccount,
        signer: attacker.publicKey,
      })
      .signers([attacker])
      .rpc();
    }catch(e){
      console.log("Exploit failed:", e);
    }

    console.log("Attacker balance after exploit:", 
      await anchor.getProvider().connection.getBalance(attacker.publicKey));

    console.log("lamport balance of pdaAccount",
    await anchor.getProvider().connection.getBalance(pdaAccount));

  });
});

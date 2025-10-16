import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day24 } from "../target/types/day_24";

// this airdrops sol to an address
async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount);
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

describe("day_24", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day24 as Program<Day24>;

  // it("Is initialized!", async () => {
  //   const newKeypair = anchor.web3.Keypair.generate();
  //   await airdropSol(newKeypair.publicKey, 1e9); // 1 SOL
  //   const frenKeypair = anchor.web3.Keypair.generate();
  //   await airdropSol(frenKeypair.publicKey, 1e9); // 1 SOL
  //   let seeds = [];
  //   const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

  //   await program.methods.initialize().accounts({
  //     myStorage: myStorage,
  //     fren: frenKeypair.publicKey // ** THIS MUST BE EXPLICITLY SPECIFIED **
  //   }).signers([frenKeypair]).rpc();
  // });

  it("other writes in storage!", async () => {
    const alice = anchor.web3.Keypair.generate();
    const bob = anchor.web3.Keypair.generate();

    const airdrop_alice_tx = await anchor.getProvider().connection.requestAirdrop(alice.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdrop_alice_tx);

    const airdrop_alice_bob = await anchor.getProvider().connection.requestAirdrop(bob.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdrop_alice_bob);
    
    let seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

// ALICE INITIALIZE ACCOUNT
    await program.methods.initialize().accounts({
      myStorage: myStorage,
      fren: alice.publicKey
    }).signers([alice]).rpc();

    // BOB WRITE TO ACCOUNT
    await program.methods.updateValue(new anchor.BN(3)).accounts({
      myStorage: myStorage,
      fren: bob.publicKey
    }).signers([bob]).rpc();

    let value = await program.account.myStorage.fetch(myStorage);
    console.log(`value stored is ${value.x}`);
  });
});

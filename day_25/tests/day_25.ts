import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day25 } from "../target/types/day_25";
import fs  from 'fs';

import privateKey from '/Users/aleksandar/.config/solana/id.json';

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

describe("day_25", () => {
  // Configure the client to use the local cluster.
  const deployer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(privateKey));

  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day25 as Program<Day25>;

  it("Is initialized -- PDA version", async () => {
    const seeds = []
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    console.log("the storage account address is", myPda.toBase58());

    const tx = await program.methods.initializePda().accounts({myPda: myPda}).rpc();
  });

  it("Is initialized -- keypair version", async () => {
		
    const newKeypair = anchor.web3.Keypair.generate();
    const secondKeypair = anchor.web3.Keypair.generate();

    await airdropSol(newKeypair.publicKey, 1e9); // 1 SOL

    console.log("the keypair account address is", newKeypair.publicKey.toBase58());

    await program.methods.initializeKeypairAccount()
      .accounts({myKeypairAccount: newKeypair.publicKey})
      .signers([newKeypair]) // the signer must be the keypair
      .rpc();

      // this fails because you cannot create an arbitrary account without signing it
      // await program.methods.initializeKeypairAccount()
    //   .accounts({myKeypairAccount: secondKeypair.publicKey})
    //   .signers([newKeypair]) // the signer must be the keypair
    //   .rpc();


    // this again fails because the Solana runtime will not let you do this
    // const seeds = []
    // const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
    //  await program.methods.initializeKeypairAccount()
    //   .accounts({myKeypairAccount: pda})
    //   .signers([newKeypair]) // the signer must be the keypair
    //   .rpc();
  });

  it("writing to kp account fail", async () => {

    const newKeypair = anchor.web3.Keypair.generate();
    var recieverWallet = anchor.web3.Keypair.generate();

    await airdropSol(newKeypair.publicKey, 10);

    var transaction = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: newKeypair.publicKey,
        toPubkey: recieverWallet.publicKey,
        lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
      }),
    );
    await anchor.web3.sendAndConfirmTransaction(anchor.getProvider().connection, transaction, [newKeypair]);
    console.log('sent 1 lamport') 

    await program.methods.initializeKeypairAccount()
      .accounts({myKeypairAccount: newKeypair.publicKey})
      .signers([newKeypair]) // the signer must be the keypair
      .rpc();
      
    console.log("initialized");
    // try to transfer again, this fails BECAUSE NOW IT IS OWNED BY THE PROGRAM
    var transaction = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: newKeypair.publicKey,
        toPubkey: recieverWallet.publicKey,
        lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
      }),
    );
    try {
      await anchor.web3.sendAndConfirmTransaction(anchor.getProvider().connection, transaction, [newKeypair]);
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  });


  it("Console log account owner", async () => {

    console.log(`The program address is ${program.programId}`) 
    const newKeypair = anchor.web3.Keypair.generate();
    var recieverWallet = anchor.web3.Keypair.generate();

    // get account owner before initialization
    await airdropSol(newKeypair.publicKey, 10);
    const accountInfoBefore = await anchor.getProvider().connection.getAccountInfo(newKeypair.publicKey);
    console.log(`initial keypair account owner is ${accountInfoBefore.owner}`);

    await program.methods.initializeKeypairAccount()
      .accounts({myKeypairAccount: newKeypair.publicKey})
      .signers([newKeypair]) // the signer must be the keypair
      .rpc();
      
    // get account owner after initialization
	
    const accountInfoAfter = await anchor.getProvider().connection.getAccountInfo(newKeypair.publicKey);
    console.log(`initial keypair account owner is ${accountInfoAfter.owner}`);


// The program address is 46P6ZJdqSh9kYW8se686Gfr1UTNqJCsqYdzSUf37U3qK
// initial keypair account owner is 11111111111111111111111111111111
// initial keypair account owner is 46P6ZJdqSh9kYW8se686Gfr1UTNqJCsqYdzSUf37U3qK
  });
});

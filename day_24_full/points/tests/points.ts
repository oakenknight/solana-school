import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Points } from "../target/types/points";

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
describe("points", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.points as Program<Points>;

  it("Alice transfers to Bob!", async () => {
    const alice = anchor.web3.Keypair.generate();
    const bob = anchor.web3.Keypair.generate();
    
    const airdrop_alice_tx = await anchor.getProvider().connection.requestAirdrop(alice.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdrop_alice_tx);

    const airdrop_bob_tx = await anchor.getProvider().connection.requestAirdrop(bob.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdrop_bob_tx);


    let seeds_alice = [alice.publicKey.toBytes()];
    let seeds_bob = [bob.publicKey.toBytes()];

    let [playerAlice, _bumpA] = await anchor.web3.PublicKey.findProgramAddressSync(seeds_alice, program.programId);
    let [playerBob, _bumpB] = await anchor.web3.PublicKey.findProgramAddressSync(seeds_bob, program.programId);

    await program.methods.initialize().accounts({
      player: playerAlice,
      signer: alice.publicKey,
    }).signers([alice]).rpc();

    await program.methods.initialize().accounts({
      player: playerBob,
      signer: bob.publicKey,
    }).signers([bob]).rpc();

    console.log(`Alice initially has ${(await program.account.player.fetch(playerAlice)).points} points`);
    console.log(`Bob initially has ${(await program.account.player.fetch(playerBob)).points} points`)
    
    await program.methods.transferPoints(5).accounts({
      from: playerAlice,
      to: playerBob,
      authority: alice.publicKey,
    }).signers([alice]).rpc();

    // this causes Error Code: InsufficientPoints
    // await program.methods.transferPoints(15).accounts({
    //   from: playerAlice,
    //   to: playerBob,
    //   authority: alice.publicKey,
    // }).signers([alice]).rpc();

    // this causes SignerIsNotAuthority error
    //await program.methods.transferPoints(5).accounts({
    //   from: playerAlice,
    //   to: playerBob,
    //   authority: bob.publicKey,
    // }).signers([bob]).rpc();

    console.log(`Alice has ${(await program.account.player.fetch(playerAlice)).points} points`);
    console.log(`Bob has ${(await program.account.player.fetch(playerBob)).points} points`)
  });
});

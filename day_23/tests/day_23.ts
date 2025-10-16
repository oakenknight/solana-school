import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day23 } from "../target/types/day_23";

describe("day_23", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day23 as Program<Day23>;

  async function printAccountBalance(account) {
      const balance = await anchor.getProvider().connection.getBalance(account);
      console.log(`${account} has ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  }

  it("Is sends to one recipient!", async () => {
    const recipient = anchor.web3.Keypair.generate();
    await printAccountBalance(recipient.publicKey);

    let amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods.sendSol(amount).accounts({to:recipient.publicKey}).rpc();
    await printAccountBalance(recipient.publicKey);
  });

  it("Split sol!", async () => {
    const recipient1 = anchor.web3.Keypair.generate();
    const recipient2 = anchor.web3.Keypair.generate();
    const recipient3 = anchor.web3.Keypair.generate();
    const recipient4 = anchor.web3.Keypair.generate();
    const recipient5 = anchor.web3.Keypair.generate();

    await printAccountBalance(recipient1.publicKey);
    await printAccountBalance(recipient2.publicKey);
    await printAccountBalance(recipient3.publicKey);
    await printAccountBalance(recipient4.publicKey);
    await printAccountBalance(recipient5.publicKey);

    const accountMeta1 = {pubkey: recipient1.publicKey, isWritable: true, isSigner: false};
    const accountMeta2 = {pubkey: recipient2.publicKey, isWritable: true, isSigner: false};
    const accountMeta3 = {pubkey: recipient3.publicKey, isWritable: true, isSigner: false};
    const accountMeta4 = {pubkey: recipient4.publicKey, isWritable: true, isSigner: false};
    const accountMeta5 = {pubkey: recipient5.publicKey, isWritable: true, isSigner: false};


    let amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
    await program.methods.splitSol(amount)
      .remainingAccounts([accountMeta1, accountMeta2, accountMeta3, accountMeta4  , accountMeta5])
      .rpc();
    await printAccountBalance(recipient1.publicKey);
    await printAccountBalance(recipient2.publicKey);
    await printAccountBalance(recipient3.publicKey);
    await printAccountBalance(recipient4.publicKey);
    await printAccountBalance(recipient5.publicKey);
  });

  
});

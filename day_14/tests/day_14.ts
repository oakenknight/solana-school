import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day14 } from "../target/types/day_14";

describe("day_14", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day14 as Program<Day14>;
  let myKeypair = anchor.web3.Keypair.generate();
  let firstSigner = anchor.web3.Keypair.generate();
  let secondSigner = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize()
    .accounts({
      signer1: program.provider.publicKey,
      signer2: myKeypair.publicKey,
    })
    .signers([myKeypair]) //we only have one signer in the array, instead of two. Anchor automatically passes the wallet account in the provider as a signer, so we don’t need to add it to the signers array again.
    .rpc();
    console.log("The signer1: ", program.provider.publicKey.toBase58());
    console.log("The signer2: ", myKeypair.publicKey.toBase58());
  });


  it("Is exercise!", async () => {
    // Add your test here.
    const tx = await program.methods.exercise()
    .accounts({
      providerSignature: program.provider.publicKey,
      signer1: firstSigner.publicKey,
      signer2: secondSigner.publicKey,
    })
    .signers([firstSigner, secondSigner]) //we only have one signer in the array, instead of two. Anchor automatically passes the wallet account in the provider as a signer, so we don’t need to add it to the signers array again.
    .rpc();
    console.log("The provider_signature: ", program.provider.publicKey.toBase58());
    console.log("The signer1: ", firstSigner.publicKey.toBase58());
    console.log("The signer2: ", secondSigner.publicKey.toBase58());
  });

  it("Is called by the owner - happy path" , async () => {
    const tx = await program.methods.gatedFunction()
    .accounts({
      owner: program.provider.publicKey,
    })
    .rpc();
    console.log("The owner: ", program.provider.publicKey.toBase58());
  });
  it("Is called by the owner - sad path" , async () => {
    try {
      const tx = await program.methods.gatedFunction()
      .accounts({
        owner: myKeypair.publicKey,
      })
      .signers([myKeypair])
      .rpc();
      console.log("The owner: ", myKeypair.publicKey.toBase58());
    } catch (error) {
      console.log("The error message: ", error);
    }
  });
});

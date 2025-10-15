import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Read } from "../target/types/read";

describe("read", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.read as Program<Read>;

  it("Is initialized!", async () => {
    const otherProgramAddress = "DaxYGeN9H1YXqjPSKxpWfecEUVg5qisL55NoC723Tc44";
    const otherProgramId = new anchor.web3.PublicKey(otherProgramAddress);
    const otherIdl = JSON.parse(require("fs").readFileSync("../simple_storage/target/idl/simple_storage.json", "utf8"));
    
    const otherProgram = new anchor.Program(otherIdl, anchor.getProvider());

    const seeds = [];
    const [my_storage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, otherProgramId);
    let storage = await otherProgram.account.myStorage.fetch(my_storage);
    console.log("The x value is", storage.x.toString());
    console.log("The y value is", storage.y.toString());
    console.log("The z value is", storage.z.toString());
  });
});

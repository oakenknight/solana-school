import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError } from "@coral-xyz/anchor";
import { Day4 } from "../target/types/day_4";
import { assert } from "chai";
describe("day_4", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day4 as Program<Day4>;
  it("Input tests", async () => {
    
    try {
      const tx = await program.methods
        .limitRange(new anchor.BN(5))
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (_err) {
      assert.isTrue(_err instanceof AnchorError);
      const err = _err as AnchorError;
      const errMsg = "a is too small";
      assert.equal(err.error.errorMessage, errMsg);
      console.log("Error number: ", err.error.errorCode.number);
    }

    try {
        const tx = await program.methods
          .limitRange(new anchor.BN(50))
          .rpc();
        console.log("Your transaction signature", tx);
      } catch (_err) {
        assert.isTrue(_err instanceof AnchorError);
        const err = _err as AnchorError;
        const errMsg = "a is too large";
        assert.equal(err.error.errorMessage, errMsg);
        console.log("Error number: ", err.error.errorCode.number);
      }
    });
  it("Input tests require", async () => {
    try {
      const tx = await program.methods
        .limitRangeRequire(new anchor.BN(5))
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (_err) {
      assert.isTrue(_err instanceof AnchorError);
      const err = _err as AnchorError;
      const errMsg = "a is too small";
      assert.equal(err.error.errorMessage, errMsg);
      console.log("Error number: ", err.error.errorCode.number);
    }

    try {
        const tx = await program.methods
          .limitRangeRequire(new anchor.BN(50))
          .rpc();
        console.log("Your transaction signature", tx);
      } catch (_err) {
        assert.isTrue(_err instanceof AnchorError);
        const err = _err as AnchorError;
        const errMsg = "a is too large";
        assert.equal(err.error.errorMessage, errMsg);
        console.log("Error number: ", err.error.errorCode.number);
      }
    });
  it("Error test", async () => {
    // Add your test here.
    try {
      const tx = await program.methods.alwaysErrors().rpc();
      console.log("Your transaction signature", tx);
    } catch (_err) {
      assert.isTrue(_err instanceof AnchorError);
      const err: AnchorError = _err;
      const errMsg =
        "Always errors";
      assert.strictEqual(err.error.errorMessage, errMsg);
      console.log("Error number:", err.error.errorCode.number);
    }
  });
});

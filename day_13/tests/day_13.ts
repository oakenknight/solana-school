import * as anchor from "@coral-xyz/anchor";
import { BorshCoder, EventParser, Program } from "@coral-xyz/anchor";
import { Day13 } from "../target/types/day_13";

describe("day_13", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day13 as Program<Day13>;

  it("Is initialized!", async () => {
  const listenerMyEvent = program.addEventListener('myEvent', (event, slot) => {
      console.log(`slot ${slot} event value ${event.value}`);
    });

    const listenerMySecondEvent = program.addEventListener('mySecondEvent', (event, slot) => {
      console.log(`slot ${slot} event value ${event.value} event message ${event.message}`);
    });
    // Add your test here.
    await program.methods.initialize().rpc();
    
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for events to be processed

    await program.removeEventListener(listenerMyEvent);
    await program.removeEventListener(listenerMySecondEvent);
  });
});

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day31 } from "../target/types/day_31";

describe("day_31", () => {
  // Configure the client to use the local cluster.
    async function airdropSol(publicKey, amount) {    
        let airdropTx = await anchor
            .getProvider()
            .connection.requestAirdrop(
                publicKey, 
                amount * anchor.web3.LAMPORTS_PER_SOL
            );  

        await confirmTransaction(airdropTx);  
    }  

    async function confirmTransaction(tx) {    
        const latestBlockHash = await anchor
            .getProvider()
            .connection.getLatestBlockhash();

        await anchor
            .getProvider()
            .connection.confirmTransaction({      
                blockhash: latestBlockHash.blockhash,      	
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,      
                signature: tx,    
        });  
    }

    // Configure the client to use the local cluster.  
    anchor.setProvider(anchor.AnchorProvider.env());  

    const program = anchor.workspace.Day31 as Program<Day31>;  
    const wallet = anchor.workspace.Day31.provider.wallet;  

    it("Wrong owner with Account", async () => {    
        const newKeypair = anchor.web3.Keypair.generate();    
        await airdropSol(newKeypair.publicKey, 10);    

        await program.methods
        .foo()
        .accounts({someAccount: newKeypair
        .publicKey}).rpc();  
    });

	

  it("Load account with accountInfo", async () => {    
        // CREATE AN ACCOUNT NOT OWNED BY THE PROGRAM    
        const newKeypair = anchor.web3.Keypair.generate();    
        const tx = new anchor.web3.Transaction().add(      
            anchor.web3.SystemProgram.createAccount({        
                fromPubkey: wallet.publicKey,        
                newAccountPubkey: newKeypair.publicKey,        
                space: 16,        
                lamports: await anchor          
                    .getProvider()          				
                    .connection
                    .getMinimumBalanceForRentExemption(32),        		
                programId: program.programId,      
            })    
	);    

	await anchor.web3.sendAndConfirmTransaction(      
            anchor.getProvider().connection,      
            tx,      
            [wallet.payer, newKeypair]    
	);    

	// READ THE DATA IN THE ACCOUNT    
	await program.methods      
            .uncheckedFoo()      
            .accounts({ someAccount: newKeypair.publicKey })      
            .rpc();  
    });

    it("Wrong owner with Account", async () => {    
        await program.methods.hello().rpc();  
    });
});

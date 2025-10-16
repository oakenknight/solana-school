use anchor_lang::prelude::*;
use anchor_lang::system_program;
use std::str::FromStr;
declare_id!("5zxQ2jrSp8Z5es68JqXTHecDbDHLS8rJ1rDJZoRCkatW");

#[program]
pub mod crowdfund {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let initialized_pda = &ctx.accounts.pda;

        msg!("Initialized pda: {:?}", initialized_pda);
        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info().clone(),
                to: ctx.accounts.pda.to_account_info().clone(),
            },
        );

        system_program::transfer(cpi_context, amount)?;

        Ok(())
    }


    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        ctx.accounts.pda.sub_lamports(amount)?;
        ctx.accounts.signer.add_lamports(amount)?; 
        
        //withdrawing the lamport balance below the rent-exempt threshold will result in the account getting closed
        //Message: Transaction simulation failed: Error processing Instruction 0: 
        //sum of account balances before and after instruction do not match.
        //ctx.accounts.signer.add_lamports(amount + 1)?; 
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, 
        payer = signer,
        space=size_of::<Pda>() + 8,
        seeds=[],
        bump)]
    pub pda: Account<'info, Pda>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, address = Pubkey::from_str("HyysbQxjzw841JKFi1PVDbFFhs9XPAGnraRGvQDNaeg8").unwrap())]
    pub signer: Signer<'info>,

     #[account(mut)]
    pub pda: Account<'info, Pda>,
}
#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub pda: Account<'info, Pda>,
    pub system_program: Program<'info, System>,
}

#[derive(Debug)]
#[account]
pub struct Pda {}

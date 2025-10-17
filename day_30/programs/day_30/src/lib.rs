use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("5bnLoBCUHL8FeepbWfLoNQvwmuUwEBZRDBPf8CqVqbKQ");

#[program]
pub mod day_30 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<ThePda>() + 8, seeds = [], bump)]
    pub the_pda: Account<'info, ThePda>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// The close = signer instruction says to send the rent lamports to the signer, but you can specify whichever address you prefer.
// The warning is that once a program is closed, a program with the same address cannot be recreated.
#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut, close = signer, )]
    pub the_pda: Account<'info, ThePda>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
pub struct ThePda {
    pub x: u32,
}

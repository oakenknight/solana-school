use anchor_lang::prelude::*;

declare_id!("58DR9rdj5s266gQQBnD5EuMqMtiJkjjYqCKbfZAhtKbA");

#[program]
pub mod day_1 {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, Solana!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

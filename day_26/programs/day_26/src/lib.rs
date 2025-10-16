use anchor_lang::prelude::*;

declare_id!("DRvkufK4CnkdFhoL4JuNMbZYt3qLastgFV5G6KxGoxik");

#[program]
pub mod day_26 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

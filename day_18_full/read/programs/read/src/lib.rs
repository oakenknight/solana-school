use anchor_lang::prelude::*;

declare_id!("BgmaTvQri6FEdiSqACuM7KSkVZQs2kwnxquh9Cd68XfR");

#[program]
pub mod read {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

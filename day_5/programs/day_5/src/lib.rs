use anchor_lang::prelude::*;

declare_id!("CvFGHnKMoH33gv5GnihWmem6zGYDQjtKcgrSZBLCjeHL");

#[program]
pub mod day_5 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

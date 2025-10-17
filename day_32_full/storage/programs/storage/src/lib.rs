use anchor_lang::prelude::*;

declare_id!("t79DezuBqgwQA3FFjMmt9porp2LbSG2Hf4v8ov3yzXn");

#[program]
pub mod storage {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.x = 42;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<Storage>() + 8, seeds = [], bump)]
    pub storage: Account<'info, Storage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
#[account]
pub struct Storage {
    x: u64,
}

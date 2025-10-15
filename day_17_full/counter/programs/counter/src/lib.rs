use anchor_lang::prelude::*;

declare_id!("G5Fvx7cnHhdE9wDNXmWZZMtManshzZ54kJR52dsu5pA2");
const MAX_VALUE: u64 = 42;
#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.storage.count = 0;
        msg!("Initialized counter to {}", ctx.accounts.storage.count);
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        if storage.count == MAX_VALUE {
            return Err(CounterError::OverMax.into());
        }
        storage.count += 1;
        msg!("Counter incremented to {}", storage.count);
        Ok(())
    }

    pub fn print_counter(ctx: Context<PrintCounter>) -> Result<()> {
        let storage = &ctx.accounts.storage;
        msg!("Current counter value is {}", storage.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
        payer = signer,
        space = size_of::<Storage>() + 8,
        seeds=[],
        bump)]
    pub storage: Account<'info, Storage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, seeds=[], bump)]
    pub storage: Account<'info, Storage>,
}

#[derive(Accounts)]
pub struct PrintCounter<'info> {
    pub storage: Account<'info, Storage>,
}

#[account]
pub struct Storage {
    pub count: u64,
}

#[error_code]
pub enum CounterError {
    #[msg("Counter over maximum value")]
    OverMax,
}

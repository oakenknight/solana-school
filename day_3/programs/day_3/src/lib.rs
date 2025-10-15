use anchor_lang::prelude::*;

declare_id!("G8tPv4R6c3qfSSS6CddYNFjWvVJPbpXULsdh9yd8Z1R1");

#[program]
pub mod day_3 {
    use super::*;

    pub fn boaty_mc_boatface(ctx: Context<Empty>) -> Result<()> {
        Ok(())
    }
    pub fn add(ctx: Context<Empty>, a: u64, b: u64) -> Result<()> {
        let sum = a + b;
        msg!("Sum is {}", sum);
        Ok(())
    }

    pub fn sub(ctx: Context<Empty>, a: u64, b: u64) -> Result<()> {
        let difference = a - b;
        msg!("Difference is {}", difference);
        Ok(())
    }
    pub fn non_empty_account_example(ctx: Context<NonEmptyAccountExample>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Empty {}

#[derive(Accounts)]
pub struct NonEmptyAccountExample<'info> {
    signer: Signer<'info>, // Signer is something like tx.origin in Ethereum
    another_signer: Signer<'info>,
}

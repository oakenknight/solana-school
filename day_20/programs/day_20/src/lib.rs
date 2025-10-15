use anchor_lang::prelude::*;
use anchor_lang::solana_program::rent as rent_module;

declare_id!("H5UszPTUyTM2RVcK21kH8yDFWCHKiApDvRC7tUXbYBdB");

#[program]
pub mod day_20 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let cost_of_empty_acc = rent_module::ACCOUNT_STORAGE_OVERHEAD as f64
            * rent_module::DEFAULT_LAMPORTS_PER_BYTE_YEAR as f64
            * rent_module::DEFAULT_EXEMPTION_THRESHOLD;

        msg!("cost to create an empty account: {}", cost_of_empty_acc);
        // 890880

        Ok(())
    }
    pub fn initialize2(ctx: Context<Initialize2>) -> Result<()> {
        let cost_of_empty_acc = rent_module::ACCOUNT_STORAGE_OVERHEAD as f64
            * rent_module::DEFAULT_LAMPORTS_PER_BYTE_YEAR as f64
            * rent_module::DEFAULT_EXEMPTION_THRESHOLD;

        let cost_for_32_bytes = cost_of_empty_acc
            + 32 as f64
                * rent_module::DEFAULT_LAMPORTS_PER_BYTE_YEAR as f64
                * rent_module::DEFAULT_EXEMPTION_THRESHOLD;

        msg!("cost to create a 32 byte account: {}", cost_for_32_bytes);
        // 1,113,600 lamports

        Ok(())
    }

    pub fn increase_account_size(ctx: Context<IncreaseAccountSize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
              payer = signer,
              space=size_of::<MyStorage>() + 8,
              seeds = [],
              bump)]
    pub my_storage: Account<'info, MyStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize2 {}

#[derive(Accounts)]
pub struct IncreaseAccountSize<'info> {
    #[account(mut,
              // ***** 1,000 BYTE INCREMENT IS OVER HERE *****
              realloc = size_of::<MyStorage>() + 8 + 1000,
              realloc::payer = signer,
              realloc::zero = false,
              seeds = [],
              bump)]
    pub my_storage: Account<'info, MyStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyStorage {
    x: u64,
}

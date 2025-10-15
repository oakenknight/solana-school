use anchor_lang::prelude::*;

declare_id!("8puRANwi4CZ9YwxN3MvCBfpG4HJYBbjL1uhF3iGXzMey");

#[program]
pub mod day_19 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, which_map: u64, key1: u64) -> Result<()> {
        Ok(())
    }
    pub fn initialize2(ctx: Context<Initialize2>, key1: u64, key2: u64) -> Result<()> {
        Ok(())
    }
    pub fn set(ctx : Context<Set>, which_map: u64, key1:u64, value: u64) -> Result<()> {
        ctx.accounts.val.value = value;
        Ok(())
    }

    pub fn set2(ctx : Context<Set2>, key1:u64, key2:u64, value: u64) -> Result<()> {
        ctx.accounts.val2.value = value;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(which_map: u64, key1: u64)]
pub struct Initialize<'info> {
    #[account(init, 
        payer = signer,
        space = size_of::<Val>() + 8,
        seeds = [&which_map.to_le_bytes().as_ref(), &key1.to_le_bytes().as_ref()], //multiple maps
        bump)]
    val: Account<'info, Val>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(key1: u64, key2: u64)]
pub struct Initialize2<'info> {
    #[account(init, 
        payer = signer,
        space = size_of::<Val2>() + 8,
        seeds = [&key1.to_le_bytes().as_ref(), &key2.to_le_bytes().as_ref()], //nested map
        bump)]
    val2: Account<'info, Val2>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(which_map: u64, key1: u64)]
pub struct Set<'info> {
    #[account(
        mut,
        seeds = [&which_map.to_le_bytes().as_ref(), &key1.to_le_bytes().as_ref()],
        bump
    )]
    val: Account<'info, Val>,
}

#[derive(Accounts)]
#[instruction(key1: u64, key2: u64)]
pub struct Set2<'info> {
    #[account(
        mut,
        seeds = [&key1.to_le_bytes().as_ref(), &key2.to_le_bytes().as_ref()],
        bump
    )]
    val2: Account<'info, Val2>,
}

#[account]
pub struct Val {
    value: u64,
}

#[account]
pub struct Val2 {
    value: u64,
}

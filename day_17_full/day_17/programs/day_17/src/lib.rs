use anchor_lang::prelude::*;

declare_id!("64vs2eiwCfqBFUk7TyNJgiuB3QsHvhat2eLkfd8HnHH9");

#[program]
pub mod day_17 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn set(ctx: Context<Set>, new_x: u64, new_y: u64, new_z: u64) -> Result<()> {
        let my_storage = &mut ctx.accounts.my_storage;
        my_storage.x = new_x;
        my_storage.y = new_y;
        my_storage.z = new_z;
        // Alternatively, you can directly set the values like this:
        // ctx.accounts.my_storage.x = new_x;
        // ctx.accounts.my_storage.y = new_y;
        // ctx.accounts.my_storage.z = new_z;

        msg!("Updated values to: x={}, y={}, z={}", new_x, new_y, new_z);

        Ok(())
    }

    pub fn print_x(ctx: Context<PrintX>) -> Result<()> {
        let x = ctx.accounts.my_storage.x;
        msg!("Current value of x: {}", x);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space= size_of::<MyStorage>() + 8, seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct PrintX<'info> {
    // #[account(seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut, seeds=[], bump)]
    pub my_storage: Account<'info, MyStorage>,
}

#[account]
pub struct MyStorage {
    x: u64,
    y: u64,
    z: u64,
}

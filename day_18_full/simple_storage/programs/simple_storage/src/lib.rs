use anchor_lang::prelude::*;

declare_id!("DaxYGeN9H1YXqjPSKxpWfecEUVg5qisL55NoC723Tc44");

#[program]
pub mod simple_storage {
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

        msg!("Updated values to: x={}, y={}, z={}", new_x, new_y, new_z);

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

use anchor_lang::prelude::*;

declare_id!("D2qXDZbbZe5eB4Q6pnhB6HmHzs8VxqjwAbTjjMuHnTRV");

#[program]
pub mod day_15 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let mut a = Vec::new();
        a.push(1);
        a.push(2);
        a.push(3);
        a.push(4);
        a.push(5);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

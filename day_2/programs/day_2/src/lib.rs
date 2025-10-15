use anchor_lang::prelude::*;

declare_id!("8MtAjs5skniyviGAb9a7u5xdVchrAznwBmnXjyN9XJm8");

#[program]
pub mod day_2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, a: u64, b: u64, message: String) -> Result<()> {
        msg!("You sent {} and {}!", a, b);
        msg!("Your message: {}", message);
        Ok(())
    }

    pub fn array(ctx: Context<Initialize>, arr: Vec<u64>) -> Result<()> {
        msg!("Array: {:?}", arr);
        Ok(())
    }

    pub fn overflow(ctx: Context<Initialize>, a: u64, b: u64) -> Result<()> {
        let z: u64 = a - b;
        msg!("{} - {} = {}", a, b, z);
        Ok(())
    }

    pub fn checked_overflow(ctx: Context<Initialize>, a: u64, b: u64) -> Result<()> {
        let z: u64 = a.checked_sub(b).unwrap();
        msg!("{} - {} = {}", a, b, z);
        Ok(())
    }

    pub fn powers(ctx: Context<Initialize>, a: u64, b: u32) -> Result<()> {
        let z: u64 = a.pow(b);
        msg!("{} ^ {} = {}", a, b, z);
        Ok(())
    }

    pub fn croot(ctx: Context<Initialize>, a: f64) -> Result<()> {
        let z: f64 = a.cbrt();
        msg!("³√{} = {}", a, z);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

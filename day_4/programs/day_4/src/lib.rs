use anchor_lang::prelude::*;

declare_id!("mjbAcuuXJxDRR18PN9iSWAzg6LQ47LyzNZacuKfj6by");

#[program]
pub mod day_4 {
    use super::*;

    pub fn limit_range(_ctx: Context<LimitRange>, a: u64) -> Result<()> {
        if a < 10 {
            return err!(MyError::AIsTooSmall);
        }
        if a > 10 {
            return err!(MyError::AIsTooLarge);
        }
        msg!("a: {}", a);
        Ok(())
    }
    pub fn limit_range_require(_ctx: Context<LimitRange>, a: u64) -> Result<()> {
        require!(a >= 10, MyError::AIsTooSmall);
        require!(a <= 10, MyError::AIsTooLarge);

        msg!("a: {}", a);
        Ok(())
    }
    pub fn always_errors(_ctx: Context<LimitRange>) -> Result<()> {
        msg!("Will this print?");
        return err!(MyError::AlwaysErrors);
    }

    pub fn func(ctx: Context<ReturnError>) -> Result<()> {
        msg!("Will this print?"); // if error is returned, this won't print
        return err!(MyError::AlwaysErrors);
    }
}

#[derive(Accounts)]
pub struct ReturnError {}

#[derive(Accounts)]
pub struct LimitRange {}

#[error_code]
pub enum MyError {
    #[msg("a is too small")]
    AIsTooSmall,
    #[msg("a is too large")]
    AIsTooLarge,
    #[msg("Always errors")] // NEW ERROR, what do you think the error code will be?
    AlwaysErrors,
}

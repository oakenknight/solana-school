use anchor_lang::{prelude::*, solana_program::sysvar::recent_blockhashes::RecentBlockhashes};

declare_id!("EbKU8wmj7eXk9X24D24Cdx9Ybt5dY3x5tCtQqiVLJ9Sm");

#[program]
pub mod day_11 {
    use super::*;
    use chrono::*;
    pub fn initialize(ctx: Context<InitializeHashes>) -> Result<()> {
        let clock: Clock = Clock::get()?;
        msg!("Current slot: {}", clock.unix_timestamp);
        let arr = [ctx.accounts.recent_blockhashes.clone()];
        let accounts_iter = &mut arr.iter();
        let sh_sysvar_info = next_account_info(accounts_iter)?;
        let recent_blockhashes = RecentBlockhashes::from_account_info(sh_sysvar_info)?;
        let data = recent_blockhashes.last().unwrap();

        msg!("The recent block hash is: {:?}", data.blockhash); //because we are deploying to our local node, the block hash we get is that of our local node and not the Solana mainnet.
        Ok(())
    }
    pub fn get_day_of_the_week(_ctx: Context<Initialize>) -> Result<()> {
        let clock: Clock = Clock::get()?;
        let time_stamp = clock.unix_timestamp;
        let date_time = chrono::NaiveDateTime::from_timestamp_opt(time_stamp, 0).unwrap();
        let day_of_week = date_time.weekday();
        msg!("Day of the week: {}", day_of_week);
        Ok(())
    }
    //Solana has a notion of a “slot number” which is very related to the “block number” but is not the same thing.
}

#[derive(Accounts)]
pub struct Initialize {}
#[derive(Accounts)]
pub struct InitializeHashes<'info> {
    /// CHECK: readonly
    pub recent_blockhashes: AccountInfo<'info>,
}

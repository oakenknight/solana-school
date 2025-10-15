use anchor_lang::prelude::*;

declare_id!("7GH6Zd44Jag5SRYJ6ptnTxh1NgF1vG4bU7bAmU1jrgbc");

#[program]
pub mod day_12 {
    use super::*;
    use anchor_lang::solana_program::sysvar::{
        fees::Fees, instructions, recent_blockhashes::RecentBlockhashes,
    };
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let clock = Clock::get()?;

        msg!(
            "clock: {:?}",
            // Retrieve all the details of the Clock sysvar
            clock
        );
        Ok(())
    }

    pub fn epoch(ctx: Context<Initialize>) -> Result<()> {
        let epoch = EpochSchedule::get()?;

        msg!(
            "epoch: {:?}",
            // Retrieve all the details of the EpochSchedule sysvar
            epoch
        );
        Ok(())
    }

    pub fn rent(ctx: Context<Initialize>) -> Result<()> {
        let rent = Rent::get()?;

        msg!(
            "rent: {:?}",
            // Retrieve all the details of the Rent sysvar
            rent
        );
        Ok(())
    }

    pub fn initialize_stake(ctx: Context<InitializeStake>) -> Result<()> {
        // Accessing the StakeHistory sysvar
        // Create an array to store the StakeHistory account
        let arr = [ctx.accounts.stake_history.clone()];

        // Create an iterator for the array
        let accounts_iter = &mut arr.iter();

        // Get the next account info from the iterator (still StakeHistory)
        let sh_sysvar_info = next_account_info(accounts_iter)?;

        // Create a StakeHistory instance from the account info
        let stake_history = StakeHistory::from_account_info(sh_sysvar_info)?;

        msg!("stake_history: {:?}", stake_history);
        Ok(())
    }

    pub fn initialize_stake2(ctx: Context<InitializeStake2>) -> Result<()> {
        // Accessing the StakeHistory, RecentBlockhashes, and Instruction sysvars
        let arr = [ctx.accounts.instruction_sysvar.clone()];

        let account_info_iter = &mut arr.iter();

        let instructions_sysvar_account = next_account_info(account_info_iter)?;

        // Load the instruction details from the instruction sysvar account
        let instruction_details =
            instructions::load_instruction_at_checked(0, instructions_sysvar_account)?;

        msg!("instruction_details: {:?}", instruction_details);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct InitializeStake<'info> {
    /// CHECK:
    pub stake_history: AccountInfo<'info>, // We create an account for the StakeHistory sysvar
}
#[derive(Accounts)]
pub struct InitializeStake2<'info> {
    /// CHECK:
    pub stake_history: AccountInfo<'info>,
    /// CHECK:
    pub recent_blockhashes: AccountInfo<'info>,
    /// CHECK:
    pub instruction_sysvar: AccountInfo<'info>,
}

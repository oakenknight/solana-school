use anchor_lang::prelude::*;
use anchor_lang::solana_program::program as solana_program;
use anchor_lang::solana_program::rent::Rent;
use anchor_lang::solana_program::system_instruction;

declare_id!("GeWfTiPMM8eSY85gmGr41UbqfnyWxX45ozcuYMyD6Jne");

#[program]
pub mod bank {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let bank = &mut ctx.accounts.bank;
        bank.total_deposits = 0;
        msg!("Bank initialized successfully");
        Ok(())
    }

    pub fn create_user_account(ctx: Context<CreateUserAccount>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.owner = ctx.accounts.user.key();
        user_account.balance = 0;
        msg!(
            "User account created successfully for {}",
            user_account.owner
        );
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, BankError::ZeroAmount);
        let user = &mut ctx.accounts.user.key();
        let bank = &mut ctx.accounts.bank.key();

        let transfer_ix = system_instruction::transfer(user, bank, amount);

        solana_program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.bank.to_account_info(),
            ],
        )?;

        let user_account = &mut ctx.accounts.user_account;
        user_account.balance = user_account
            .balance
            .checked_add(amount)
            .ok_or(BankError::Overflow)?;

        let bank = &mut ctx.accounts.bank;

        bank.total_deposits = bank
            .total_deposits
            .checked_add(amount)
            .ok_or(BankError::Overflow)?;

        msg!("Deposited {} lamports to user account {}", amount, user);

        Ok(())
    }

    pub fn get_balance(ctx: Context<GetBalance>) -> Result<u64> {
        let user_account = &ctx.accounts.user_account;
        let balance = user_account.balance;

        msg!(
            "User {} has a balance of {} lamports",
            user_account.owner,
            balance
        );
        Ok(balance)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, BankError::ZeroAmount);

        let bank = &mut ctx.accounts.bank;
        let user_account = &mut ctx.accounts.user_account;
        let user = &mut ctx.accounts.user.key();

        require!(
            user_account.balance >= amount,
            BankError::InsufficientBalance
        );

        bank.total_deposits = bank
            .total_deposits
            .checked_sub(amount)
            .ok_or(BankError::Underflow)?;

        user_account.balance = user_account
            .balance
            .checked_sub(amount)
            .ok_or(BankError::Underflow)?;

        let rent = Rent::get()?;
        let user_account_info = ctx.accounts.user_account.to_account_info();
        let minimum_balance = rent.minimum_balance(user_account_info.data_len());

        let available_lamports = user_account_info.lamports();
        let transfer_amount = amount.min(available_lamports.saturating_sub(minimum_balance));

        user_account_info
            .try_borrow_mut_lamports()?
            .checked_sub(transfer_amount)
            .ok_or(BankError::Underflow)?;

        ctx.accounts
            .user
            .try_borrow_mut_lamports()?
            .checked_add(transfer_amount)
            .ok_or(BankError::Overflow)?;

        //could be also but is unsafe
        // **user_account_info.try_borrow_mut_lamports()? -= transfer_amount;
        // **ctx.accounts.user.try_borrow_mut_lamports()? += transfer_amount;
        msg!("Withdrawn {} lamports for {}", amount, user);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-account", user.key().as_ref()],
        bump,
        constraint = user_account.owner == user.key() @ BankError::UnauthorizedAccess,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub bank: Account<'info, Bank>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetBalance<'info> {
    pub user: Signer<'info>,

    #[account(
        seeds = [b"user-account", user.key().as_ref()],
        bump,
        constraint = user_account.owner == user.key() @ BankError::UnauthorizedAccess,
    )]
    pub user_account: Account<'info, UserAccount>,

    pub bank: Account<'info, Bank>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut,
        seeds = [b"user-account", user.key().as_ref()],
        bump,
        constraint = user_account.owner == user.key() @ BankError::UnauthorizedAccess,    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub bank: Account<'info, Bank>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer= payer, space = 8+ Bank::INIT_SPACE)]
    pub bank: Account<'info, Bank>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUserAccount<'info> {
    #[account(
        init,
        payer= user,
        space = 8+ UserAccount::INIT_SPACE,
        seeds = [b"user-account", user.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// BANK ACCOUNT TO TRACK TOTAL DEPOSITS ACROSS ALL USERS
#[account]
#[derive(InitSpace)]
pub struct Bank {
    pub total_deposits: u64,
}

// USER-SPECIFIC ACCOUNT TO TRACK INDIVIDUAL USER BALANCES
#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub owner: Pubkey,
    pub balance: u64,
}

#[error_code]
pub enum BankError {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,

    #[msg("Insufficient balance for withdrawal")]
    InsufficientBalance,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Arithmetic underflow")]
    Underflow,

    #[msg("Insufficient funds in the bank account")]
    InsufficientFunds,

    #[msg("Unauthorized access to user account")]
    UnauthorizedAccess,
}

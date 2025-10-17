use anchor_lang::prelude::*;

declare_id!("2tG9xKGUsN725CJWMoQf5SRRjS8u5mYkANg32raKXByh");

#[program]
pub mod day_31 {
    use super::*;

    pub fn foo(ctx: Context<Foo>) -> Result<()> {
        // we don't do anything with the account SomeAccount
        Ok(())
    }
    pub fn uncheckedFoo(ctx: Context<UncheckedFoo>) -> Result<()> {
        let data = &ctx.accounts.some_account.try_borrow_data()?;
        msg!("{:?}", data);
        Ok(())
    }
    pub fn hello(ctx: Context<Hello>) -> Result<()> {
        let lamports = ctx.accounts.signer.lamports();
        let address = &ctx.accounts.signer.signer_key().unwrap();
        msg!("hello {:?} you have {} lamports", address, lamports);
        Ok(())
    }
}
#[derive(Accounts)]
pub struct Hello<'info> {
    pub signer: Signer<'info>,
}
#[derive(Accounts)]
pub struct Foo<'info> {
    some_account: Account<'info, SomeAccount>,
}
#[derive(Accounts)]
pub struct UncheckedFoo<'info> {
    /// CHECK: we are just printing the data
    some_account: UncheckedAccount<'info>,
}
#[account]
pub struct SomeAccount {}

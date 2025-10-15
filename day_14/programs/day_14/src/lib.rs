use anchor_lang::prelude::*;

declare_id!("GPm5uaewY121GBfSHLcPWbNDEcvuFvEXt3Ktn5MUb6dp");
const OWNER: &str = "HyysbQxjzw841JKFi1PVDbFFhs9XPAGnraRGvQDNaeg8";

#[program]
pub mod day_14 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let signer1: &mut Signer = &mut ctx.accounts.signer1;
        let signer2: &mut Signer = &mut ctx.accounts.signer2;

        msg!("The signer1: {:?}", *signer1.key);
        msg!("The signer2: {:?}", *signer2.key);
        Ok(())
    }

    pub fn exercise(ctx: Context<Exercise>) -> Result<()> {
        let provider_signature: &mut Signer = &mut ctx.accounts.provider_signature;
        let signer1: &mut Signer = &mut ctx.accounts.signer1;
        let signer2: &mut Signer = &mut ctx.accounts.signer2;

        msg!("The provider_signature: {:?}", *provider_signature.key);
        msg!("The signer1: {:?}", *signer1.key);
        msg!("The signer2: {:?}", *signer2.key);
        Ok(())
    }

    #[access_control(check(&ctx))]
    pub fn gated_function(ctx: Context<OnlyOwner>) -> Result<()> {
        let owner: &mut Signer = &mut ctx.accounts.owner;
        msg!("The owner: {:?}", *owner.key);
        Ok(())
    }
}
fn check(ctx: &Context<OnlyOwner>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.owner.key(),
        OWNER.parse::<Pubkey>().unwrap(),
        CustomError::NotOwner
    );
    Ok(())
}
#[derive(Accounts)]
pub struct Initialize<'info> {
    pub signer1: Signer<'info>,
    pub signer2: Signer<'info>,
}

#[derive(Accounts)]
pub struct Exercise<'info> {
    pub provider_signature: Signer<'info>,
    pub signer1: Signer<'info>,
    pub signer2: Signer<'info>,
}

#[derive(Accounts)]
pub struct OnlyOwner<'info> {
    pub owner: Signer<'info>,
}

#[error_code]
pub enum CustomError {
    #[msg("You are not the owner!")]
    NotOwner,
}

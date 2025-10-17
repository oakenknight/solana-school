use anchor_lang::prelude::*;

declare_id!("H8pBZL58dfcmMZsf8uUcimSxamzf5gWQj1Z3ATn5uNa8");

#[program]
pub mod day_32 {
    use super::*;

    pub fn read_other_data(ctx: Context<ReadOtherData>) -> Result<()> {
        let data_account = &ctx.accounts.other_data;

        if data_account.data_is_empty() {
            return err!(MyError::NoData);
        }

        let mut data_slice: &[u8] = &data_account.data.borrow();

        let data_struct: Storage = AccountDeserialize::try_deserialize(&mut data_slice)?;

        msg!("The value of y is: {}", data_struct.y);

        Ok(())
    }
}

#[error_code]
pub enum MyError {
    #[msg("No data")]
    NoData,
}

#[derive(Accounts)]
pub struct ReadOtherData<'info> {
    /// CHECK: We do not own this account so
    // we must be very cautious with how we
    // use the data
    other_data: UncheckedAccount<'info>,
}

#[account]
pub struct Storage {
    x: u64,
}

//Case 1: Anchor does not check if the struct field name matches
// #[account]
// pub struct Storage {
//     y: u64,
// }

//Case 2: Anchor does not check the data type
// #[account]
// pub struct Storage {
//     y: u32,
// }

/*
Case 3: Parsing more data than is there

The storage account is 16 bytes large.
It holds 8 byte for the account discriminator,
and 8 bytes for the u64 variable.
If we try to read more data than is there,
such as by defining a struct with values that require
more than 16 bytes to hold, the deserialization on read will fail
The struct above requires 16 bytes to store y and z,
but an additional 8 bytes are needed to hold
the account discriminator, making the account 24 bytes large.
*/

// #[account]
// pub struct Storage {
//     y: u64,
//     z: u64,
// }

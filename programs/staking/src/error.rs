use anchor_lang::prelude::*;

#[error_code]
pub enum CloneStakingError {
    #[msg("Cannot withdraw before the staking period ends!")]
    CannotWithdrawBeforeStakingPeriod,

    #[msg("Cannot claim reward at the same slot as last claim!")]
    CannotClaimRewardAtSameSlot,

    #[msg("Input is invalid!")]
    InvalidInput,

    #[msg("Bump not found")]
    BumpNotFound,

    #[msg("Checked Math Error")]
    CheckedMathError,
}

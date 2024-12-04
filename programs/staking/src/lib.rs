use anchor_lang::prelude::*;
mod error;
pub mod instructions;
pub mod states;

pub use instructions::*;

declare_id!("42L6bfEYntcmqVcFvHywitcaHhXF9rjYq9C9p9iWQ2X2");

#[program]
pub mod solana_staking_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        staking_period_slots: u64,
        interest_rate_per_period: u64
    ) -> Result<()> {
        instructions::initialize::execute(ctx, staking_period_slots, interest_rate_per_period)
    }

    pub fn add_stake(ctx: Context<AddStake>, amount: u64) -> Result<()> {
        instructions::add_stake::execute(ctx, amount)
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        instructions::claim_reward::execute(ctx)
    }

    pub fn withdraw_stake(ctx: Context<WithdrawStake>, amount: u64) -> Result<()> {
        instructions::withdraw_stake::execute(ctx, amount)
    }

    pub fn update_staking_params(
        ctx: Context<UpdateStakingParams>,
        params: Parameters
    ) -> Result<()> {
        instructions::update_staking_params::execute(ctx, params)
    }
}

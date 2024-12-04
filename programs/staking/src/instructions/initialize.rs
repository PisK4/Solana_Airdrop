use crate::error::*;
use crate::states::*;
use anchor_lang::prelude::*;
use anchor_spl::token::*;

pub const CLONE_STAKING_SEED: &[u8] = b"clone-staking";

#[derive(Accounts)]
#[instruction(
    staking_period_slots: u64,
)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        space = 8 + CloneStaking::INIT_SPACE,
        seeds = [CLONE_STAKING_SEED],
        bump,
        payer = admin
    )]
    pub clone_staking: Account<'info, CloneStaking>,
    /// CHECK: Admin responsibility
    pub cln_token_mint: Account<'info, Mint>,
    #[account(token::mint = cln_token_mint, token::authority = clone_staking)]
    pub cln_token_vault: Account<'info, TokenAccount>,
    /// CHECK: Admin responsibility
    pub reward_token_mint: Account<'info, Mint>,
    #[account(token::mint = reward_token_mint, token::authority = clone_staking)]
    pub reward_token_vault: Account<'info, TokenAccount>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn execute(
    ctx: Context<Initialize>,
    staking_period_slots: u64,
    interest_rate_per_period: u64
) -> Result<()> {
    let clone_staking = &mut ctx.accounts.clone_staking;
    clone_staking.admin = ctx.accounts.admin.key();
    clone_staking.cln_token_mint = ctx.accounts.cln_token_mint.key();
    clone_staking.cln_token_vault = ctx.accounts.cln_token_vault.key();
    clone_staking.reward_token_mint = ctx.accounts.reward_token_mint.key();
    clone_staking.reward_token_vault = ctx.accounts.reward_token_vault.key();
    clone_staking.staking_period_slots = staking_period_slots;
    clone_staking.interest_rate_per_period = interest_rate_per_period;
    let (_, clone_staking_bump) = Pubkey::find_program_address(
        &[CLONE_STAKING_SEED],
        &ctx.program_id
    );
    clone_staking.bump = clone_staking_bump;
    clone_staking.tiers = [Tier::default(); MAX_TIERS];

    Ok(())
}

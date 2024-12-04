/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * @category Instructions
 * @category LiquidateCometOnassetIld
 * @category generated
 */
export type LiquidateCometOnassetIldInstructionArgs = {
  user: web3.PublicKey
  cometPositionIndex: number
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category LiquidateCometOnassetIld
 * @category generated
 */
export const liquidateCometOnassetIldStruct = new beet.BeetArgsStruct<
  LiquidateCometOnassetIldInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['user', beetSolana.publicKey],
    ['cometPositionIndex', beet.u8],
    ['amount', beet.u64],
  ],
  'LiquidateCometOnassetIldInstructionArgs'
)
/**
 * Accounts required by the _liquidateCometOnassetIld_ instruction
 *
 * @property [**signer**] liquidator
 * @property [_writable_] userAccount
 * @property [_writable_] clone
 * @property [_writable_] pools
 * @property [] oracles
 * @property [_writable_] onassetMint
 * @property [_writable_] liquidatorOnassetTokenAccount
 * @property [_writable_] liquidatorCollateralTokenAccount
 * @property [_writable_] vault
 * @category Instructions
 * @category LiquidateCometOnassetIld
 * @category generated
 */
export type LiquidateCometOnassetIldInstructionAccounts = {
  liquidator: web3.PublicKey
  userAccount: web3.PublicKey
  clone: web3.PublicKey
  pools: web3.PublicKey
  oracles: web3.PublicKey
  onassetMint: web3.PublicKey
  liquidatorOnassetTokenAccount: web3.PublicKey
  liquidatorCollateralTokenAccount: web3.PublicKey
  vault: web3.PublicKey
  tokenProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const liquidateCometOnassetIldInstructionDiscriminator = [
  203, 186, 24, 213, 251, 103, 57, 65,
]

/**
 * Creates a _LiquidateCometOnassetIld_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category LiquidateCometOnassetIld
 * @category generated
 */
export function createLiquidateCometOnassetIldInstruction(
  accounts: LiquidateCometOnassetIldInstructionAccounts,
  args: LiquidateCometOnassetIldInstructionArgs,
  programId = new web3.PublicKey('C1onEW2kPetmHmwe74YC1ESx3LnFEpVau6g2pg4fHycr')
) {
  const [data] = liquidateCometOnassetIldStruct.serialize({
    instructionDiscriminator: liquidateCometOnassetIldInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.liquidator,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.userAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.clone,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.pools,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.oracles,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.onassetMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.liquidatorOnassetTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.liquidatorCollateralTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}

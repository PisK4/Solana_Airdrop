/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category WrapAsset
 * @category generated
 */
export type WrapAssetInstructionArgs = {
  amount: beet.bignum
  poolIndex: number
}
/**
 * @category Instructions
 * @category WrapAsset
 * @category generated
 */
export const wrapAssetStruct = new beet.BeetArgsStruct<
  WrapAssetInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
    ['poolIndex', beet.u8],
  ],
  'WrapAssetInstructionArgs'
)
/**
 * Accounts required by the _wrapAsset_ instruction
 *
 * @property [**signer**] user
 * @property [] clone
 * @property [] pools
 * @property [_writable_] underlyingAssetTokenAccount
 * @property [] assetMint
 * @property [_writable_] userAssetTokenAccount
 * @property [_writable_] onassetMint
 * @property [_writable_] userOnassetTokenAccount
 * @category Instructions
 * @category WrapAsset
 * @category generated
 */
export type WrapAssetInstructionAccounts = {
  user: web3.PublicKey
  clone: web3.PublicKey
  pools: web3.PublicKey
  underlyingAssetTokenAccount: web3.PublicKey
  assetMint: web3.PublicKey
  userAssetTokenAccount: web3.PublicKey
  onassetMint: web3.PublicKey
  userOnassetTokenAccount: web3.PublicKey
  tokenProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const wrapAssetInstructionDiscriminator = [
  75, 63, 96, 57, 92, 198, 158, 199,
]

/**
 * Creates a _WrapAsset_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WrapAsset
 * @category generated
 */
export function createWrapAssetInstruction(
  accounts: WrapAssetInstructionAccounts,
  args: WrapAssetInstructionArgs,
  programId = new web3.PublicKey('C1onEW2kPetmHmwe74YC1ESx3LnFEpVau6g2pg4fHycr')
) {
  const [data] = wrapAssetStruct.serialize({
    instructionDiscriminator: wrapAssetInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.user,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.clone,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.pools,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.underlyingAssetTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.assetMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.userAssetTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.onassetMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userOnassetTokenAccount,
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

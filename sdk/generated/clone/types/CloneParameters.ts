/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'
/**
 * This type is used to derive the {@link CloneParameters} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link CloneParameters} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
export type CloneParametersRecord = {
  AddAuth: { address: web3.PublicKey }
  RemoveAuth: { address: web3.PublicKey }
  CometCollateralLiquidationFee: { value: number }
  CometOnassetLiquidationFee: { value: number }
  BorrowLiquidationFee: { value: number }
  TreasuryAddress: { address: web3.PublicKey }
  CollateralizationRatio: { value: number }
  NonAuthLiquidationsEnabled: { value: boolean }
}

/**
 * Union type respresenting the CloneParameters data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isCloneParameters*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
export type CloneParameters = beet.DataEnumKeyAsKind<CloneParametersRecord>

export const isCloneParametersAddAuth = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'AddAuth' } => x.__kind === 'AddAuth'
export const isCloneParametersRemoveAuth = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'RemoveAuth' } => x.__kind === 'RemoveAuth'
export const isCloneParametersCometCollateralLiquidationFee = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'CometCollateralLiquidationFee' } =>
  x.__kind === 'CometCollateralLiquidationFee'
export const isCloneParametersCometOnassetLiquidationFee = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'CometOnassetLiquidationFee' } =>
  x.__kind === 'CometOnassetLiquidationFee'
export const isCloneParametersBorrowLiquidationFee = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'BorrowLiquidationFee' } =>
  x.__kind === 'BorrowLiquidationFee'
export const isCloneParametersTreasuryAddress = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'TreasuryAddress' } =>
  x.__kind === 'TreasuryAddress'
export const isCloneParametersCollateralizationRatio = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'CollateralizationRatio' } =>
  x.__kind === 'CollateralizationRatio'
export const isCloneParametersNonAuthLiquidationsEnabled = (
  x: CloneParameters
): x is CloneParameters & { __kind: 'NonAuthLiquidationsEnabled' } =>
  x.__kind === 'NonAuthLiquidationsEnabled'

/**
 * @category userTypes
 * @category generated
 */
export const cloneParametersBeet = beet.dataEnum<CloneParametersRecord>([
  [
    'AddAuth',
    new beet.BeetArgsStruct<CloneParametersRecord['AddAuth']>(
      [['address', beetSolana.publicKey]],
      'CloneParametersRecord["AddAuth"]'
    ),
  ],

  [
    'RemoveAuth',
    new beet.BeetArgsStruct<CloneParametersRecord['RemoveAuth']>(
      [['address', beetSolana.publicKey]],
      'CloneParametersRecord["RemoveAuth"]'
    ),
  ],

  [
    'CometCollateralLiquidationFee',
    new beet.BeetArgsStruct<
      CloneParametersRecord['CometCollateralLiquidationFee']
    >(
      [['value', beet.u16]],
      'CloneParametersRecord["CometCollateralLiquidationFee"]'
    ),
  ],

  [
    'CometOnassetLiquidationFee',
    new beet.BeetArgsStruct<
      CloneParametersRecord['CometOnassetLiquidationFee']
    >(
      [['value', beet.u16]],
      'CloneParametersRecord["CometOnassetLiquidationFee"]'
    ),
  ],

  [
    'BorrowLiquidationFee',
    new beet.BeetArgsStruct<CloneParametersRecord['BorrowLiquidationFee']>(
      [['value', beet.u16]],
      'CloneParametersRecord["BorrowLiquidationFee"]'
    ),
  ],

  [
    'TreasuryAddress',
    new beet.BeetArgsStruct<CloneParametersRecord['TreasuryAddress']>(
      [['address', beetSolana.publicKey]],
      'CloneParametersRecord["TreasuryAddress"]'
    ),
  ],

  [
    'CollateralizationRatio',
    new beet.BeetArgsStruct<CloneParametersRecord['CollateralizationRatio']>(
      [['value', beet.u8]],
      'CloneParametersRecord["CollateralizationRatio"]'
    ),
  ],

  [
    'NonAuthLiquidationsEnabled',
    new beet.BeetArgsStruct<
      CloneParametersRecord['NonAuthLiquidationsEnabled']
    >(
      [['value', beet.bool]],
      'CloneParametersRecord["NonAuthLiquidationsEnabled"]'
    ),
  ],
]) as beet.FixableBeet<CloneParameters, CloneParameters>
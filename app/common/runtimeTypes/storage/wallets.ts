import * as t from "io-ts"
import * as CryptoKeyPath from "app/main/crypto/keyPath"
import { Version } from "app/common/runtimeTypes/storage"

export const WalletInfo = t.type({
  id: t.string,
  caption: t.string
}, "WalletInfo")
export type WalletInfo = t.TypeOf<typeof WalletInfo>

export const WalletInfoCollection = t.array(WalletInfo)
export type WalletInfoCollection = t.TypeOf<typeof WalletInfoCollection>

export const Wallets = t.intersection([
  Version,
  t.type({
    infos: WalletInfoCollection
  }, "Wallets"),
])
export type Wallets = t.TypeOf<typeof Wallets>

export const Mnemonics = t.type({
  mnemonics: t.string
})
export type Mnemonics = t.TypeOf<typeof Mnemonics>

export const NewMnemonicsSuccess = t.intersection([
  t.type({ kind: t.literal("SUCCESS") }),
  Mnemonics
])
export type NewMnemonicsSuccess = t.TypeOf<typeof NewMnemonicsSuccess>

export const newMnemonicsErrors = {
  GENERIC_ERROR: t.literal("GENERIC_ERROR"),
  DEPENDENCY_ERROR_GENERATE_MNEMONICS: t.literal("DEPENDENCY_ERROR_GENERATE_MNEMONICS"),
  INVALID_MNEMONICS_TYPE: t.literal("INVALID_MNEMONICS_TYPE"),
  ERROR_UPDATING_UNCONSOLIDATED_WALLET: t.literal("ERROR_UPDATING_UNCONSOLIDATED_WALLET")
}

export const NewMnemonicsErrors = t.union(Object.values(newMnemonicsErrors))
export type NewMnemonicsErrors = t.TypeOf<typeof NewMnemonicsErrors>

export const NewMnemonicsError = t.type({
  kind: t.literal("ERROR"),
  error: NewMnemonicsErrors
})
export type NewMnemonicsError = t.TypeOf<typeof NewMnemonicsError>

export const NewMnemonicsResponse = t.taggedUnion("kind", [NewMnemonicsSuccess, NewMnemonicsError])
export type NewMnemonicsResponse = t.TypeOf<typeof NewMnemonicsResponse>

export const KeyPath = new t.Type<Array<number>, string>(
  "KeyPath",
  /** is: a custom type guard */
  t.array(t.number).is,
  /** validate: succeeds if a value of type t.mixed can be decoded into Array<number> */
  (input: t.mixed, context: t.Context): t.Validation<Array<number>> =>
    t.string.validate(input, context).chain(keyPath => {
      let res: t.Validation<Array<number>>
      try {
        res = t.success(CryptoKeyPath.fromString(keyPath))
      } catch (e) {
        res = t.failure(keyPath, context)
      }

      return res
    }),
  /** encode: converts a value of type Array<number> to string */
  (a) => CryptoKeyPath.toString(a)
)
export type KeyPath = t.TypeOf<typeof KeyPath>

/**
 * Custom type to encode/decode Buffer to hex string
 * @type {Type<Buffer, string>}
 */
export const SerializableBuffer = new t.Type<Buffer, string>(
  "SerializableBuffer",
  /** is: a custom type guard */
  (m): m is Buffer => m instanceof Buffer,
  /** validate: succeeds if a value of type t.mixed can be decoded to a value of type Buffer */
  (input: t.mixed, context: t.Context): t.Validation<Buffer> =>
    t.string.validate(input, context).chain(inputString => {
      let res: t.Validation<Buffer>
      try {
        const buf = Buffer.from(inputString, "hex")
        if (inputString.length !== 0 && buf.length === 0) {
          throw new Error("Invalid hex value found in hexString")
        }
        res = t.success(buf)
      } catch (e) {
        res = t.failure(inputString, context)
      }

      return res
    }),
  /** encode: converts a value of type Buffer to a value of type hex string */
  (a) => a.toString("hex")
)

export const ExtendedKey = t.type({
  type: t.union([t.literal("private"), t.literal("public")], "type"),
  key: SerializableBuffer,
  chainCode: SerializableBuffer
}, "ExtendedKey")
export type ExtendedKey = t.TypeOf<typeof ExtendedKey>

// Reference to transaction output
export const Outpoint = t.type({
  txid: t.string,
  index: t.number
}, "Outpoint")
export type Outpoint = t.TypeOf<typeof Outpoint>

export const Utxo = t.type({
  outpoint: Outpoint,
  internal: t.boolean,
}, "Utxo")
export type Utxo = t.TypeOf<typeof Utxo>

export const Stxo = t.type({
  outpoint: Outpoint
}, "Stxo")
export type Stxo = t.TypeOf<typeof Stxo>

export const FinalKey = t.type({
  extendedKey: ExtendedKey,
  keyPath: KeyPath,
  pkh: t.string,
  utxos: t.array(Utxo),
  stxos: t.array(Stxo)
}, "FinalKey")
export type FinalKey = t.TypeOf<typeof FinalKey>

export const KeyChain = t.type({
  keyPath: KeyPath,
  finalKeys: t.array(FinalKey)
}, "KeyChain")
export type KeyChain = t.TypeOf<typeof KeyChain>

export const EpochsInfo = t.intersection([
  t.type({
    last: t.number
  }),
  t.partial({
    born: t.number
  })
], "EpochsInfo")
export type EpochsInfo = t.TypeOf<typeof EpochsInfo>

export const Account = t.type({
  keyPath: KeyPath,
  // this will likely contain chain 0 (external), 1 (internal) and 2 (rad<sup>1</sup>)
  keyChains: t.array(KeyChain),
  // how much value is in this branch of the Wip3 key tree
  balance: t.number
}, "Account")
export type Account = t.TypeOf<typeof Account>

export const Seed = t.type({
  masterSecret: SerializableBuffer,
  chainCode: SerializableBuffer
}, "Seed")
export type Seed = t.TypeOf<typeof Seed>

export const Wip3SeedInfo = t.type({
  kind: t.literal("Wip3"),
  seed: Seed
}, "Wip3SeedInfo")

export type Wip3SeedInfo = t.TypeOf<typeof Wip3SeedInfo>

export const SeedInfo = t.union([Wip3SeedInfo], "SeedInfo") // , TrezorSeedInfo, LedgerSeedInfo])
export type SeedInfo = t.TypeOf<typeof SeedInfo>

export const Wallet = t.intersection([
  Version,
  WalletInfo,
  t.type({
    seed: SeedInfo,
    epochs: EpochsInfo,
    purpose: t.literal(0x80000003), // this wallet uses derivation path m/3'/*
    accounts: t.array(Account)
  }, "Wallet"),
])
export type Wallet = t.TypeOf<typeof Wallet>

// UnconsolidatedWallet represents a transient wallet which is being created
export const UnconsolidatedWallet = t.partial({
  id: t.string,
  seed: Seed,
  mnemonics: t.string
}, "UnconsolidatedWallet")
export type UnconsolidatedWallet = t.TypeOf<typeof UnconsolidatedWallet>
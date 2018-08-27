import * as t from "io-ts"

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

export const ImportSeedParams = t.taggedUnion(
  "kind",
  [
    t.type({
      kind: t.literal("mnemonics"),
      mnemonics: t.string
    }, "mnemonics"),
    t.type({
      kind: t.literal("xprv"),
      xprv: t.string
    }, "xprv")
  ], "ImportSeedParams")
export type ImportSeedParams = t.TypeOf<typeof ImportSeedParams>

const ImportSeedSuccess = t.type({
  kind: t.literal("SUCCESS"),
})

export const importSeedErrors = {
  INVALID_METHOD_PARAMS: t.literal("INVALID_METHOD_PARAMS"),
  INVALID_MNEMONICS: t.literal("INVALID_MNEMONICS"),
  INVALID_XPRV: t.literal("INVALID_XPRV"),
  MISMATCHING_MNEMONICS: t.literal("MISMATCHING_MNEMONICS"),
  UNCONSOLIDATED_UPDATE_FAILURE: t.literal("UNCONSOLIDATED_UPDATE_FAILURE")
}

export const ImportSeedErrors = t.union(Object.values(importSeedErrors))
export type ImportSeedErrors = t.TypeOf<typeof ImportSeedErrors>

export const ImportSeedError = t.type({
  kind: t.literal("ERROR"),
  error: ImportSeedErrors
})
export type ImportSeedError = t.TypeOf<typeof ImportSeedError>

export const ImportSeedResponse = t.taggedUnion("kind", [
  ImportSeedSuccess,
  ImportSeedError,
], "ImportSeedResponse")
export type ImportSeedResponse = t.TypeOf<typeof ImportSeedResponse>
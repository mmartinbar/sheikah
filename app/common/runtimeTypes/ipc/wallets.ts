import { Empty } from "app/common/runtimeTypes/index"
import { WalletInfos } from "app/common/runtimeTypes/storage/wallets"
import * as t from "io-ts"

export const GetWalletsParams = Empty
export type GetWalletsParams = t.TypeOf<typeof GetWalletsParams>

export const GetWalletsResponse = WalletInfos
export type GetWalletsResponse = t.TypeOf<typeof GetWalletsResponse>
import { Wallet } from "app/common/runtimeTypes/storage/wallets"
import { Transactions, Transaction, P2PKHTxOutput } from "app/common/runtimeTypes/storage/transactions"
import { prefilledWallet } from "app/renderer/prefilledWallet"
import { CURRENT_TRANSACTIONS_VERSION } from "app/common/runtimeTypes/storage";

// Use prefilled wallet as wallet fixture
export const walletFixture: Wallet = prefilledWallet

// First transaction in the map
export const tx1id = "tx1"
const tx1: Transaction = {
    _v: CURRENT_TRANSACTIONS_VERSION,
    txid: tx1id,
    locktime: 0,
    vin: [{outpoint: {txid: "tx0", index: 0}}],
    vout: [{kind: "P2PKH", value: 1, pkh: ""} as P2PKHTxOutput],
    blkid: "blk1",
    height: 1
}

// Second transaction in the map
export const tx2id = "tx2"
const tx2: Transaction = {
    _v: CURRENT_TRANSACTIONS_VERSION,
    txid: tx2id,
    locktime: 0,
    vin: [{outpoint: {txid: "tx1", index: 0}}],
    vout: [{kind: "P2PKH", value: 1, pkh: "2147483651,2147488567,2147483648,0,0"} as P2PKHTxOutput],
    blkid: "blk1",
    height: 1
}

// Transactions dictionary 
export const transactionsFixture: Transactions = { tx1id: tx1, tx2id: tx2 }
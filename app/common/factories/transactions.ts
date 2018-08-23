import { Account, KeyChain, FinalKey, Stxo, Utxo } from "app/common/runtimeTypes/storage/wallets"
import { Transactions, TxInput, TxOutput } from "app/common/runtimeTypes/storage/transactions"

// Type to represent a transaction
// Sent (to)
// Received (from) type
// Change (internal) type
export type ComputedTransactionType = "from" | "to" | "internal"

// Type to represent a transaction as represented in the UI
export interface ComputedTransaction {
  // Tx type
  type: ComputedTransactionType,

  // Value
  value: number,

  // Addresses
  addresses: Array<string>,

  // Timelock (0 for no timelock)
  timelock: number

  // Epoch => confirmed tx
  // No epoch => unconfirmed tx
  epoch?: number
}

// Type to represent an array of transactions (as represented in the UI)
export type ComputedTransactions = Array<ComputedTransaction>

/**
 * Function to check if a pkh belongs to an account
 * @param account
 * @param pkh
 */
export function inAccount(account: Account, pkh: string) {
  return account.keyChains.some(inKeyChain(pkh))
}

/**
 * Function to check if a pkh belongs to a key chain
 * @param pkh
 */
function inKeyChain(pkh: string) {
  return (keyChain: KeyChain) => {
    return keyChain.finalKeys.some(inFinalKey(pkh))
  }
}

/**
 * Function to check if a pkh belongs to a final key
 * @param pkh
 */
function inFinalKey(pkh: string) {
  return (fk: FinalKey) => {
    return fk.pkh === pkh
  }
}

/**
 * Factory function for computed transaction
 * @param type
 * @param value
 * @param addresses
 * @param timelock
 * @param epoch
 */
export function buildComputedTransaction(
  type: ComputedTransactionType,
  value: number,
  addresses: Array<string>,
  timelock: number,
  epoch?: number
) {
  return {
    type,
    value,
    addresses,
    timelock,
    epoch
  }
}

/**
 * Function to compute an array of transactions to be represented given a wallet
 * and raw transactions map
 * @param wallet
 * @param transactins
 */
export function computeTransactions(account: Account,
  transactions: Transactions): ComputedTransactions {
  // Initialize computed txs
  const computedTxs: ComputedTransactions = []

  // Iterate over all final keys in the account
  account.keyChains.forEach((keychain: KeyChain) => {
    keychain.finalKeys.forEach((fk: FinalKey) => {
      // Iterate over all utxos
      fk.utxos
        .filter((utxo: Utxo) => !utxo.internal)
        .filter((utxo: Utxo) => transactions[utxo.outpoint.txid])
        .forEach((utxo: Utxo) => {
          const tx = transactions[utxo.outpoint.txid]
          const output = tx.vout[utxo.outpoint.index]
          const addresses = tx.vin.map((input: TxInput) => { return input.address })

          computedTxs.push(buildComputedTransaction("from", output.value, addresses, tx.locktime, tx.height))
        })

      // Iterate over all stxos 
      fk.stxos
        .filter((stxo: Stxo) => { return transactions[stxo.outpoint.txid] !== undefined })
        .forEach((stxo: Stxo) => {
          const tx = transactions[stxo.outpoint.txid]
          const output = tx.vout[stxo.outpoint.index]
          const addresses = tx.vout.map((output: TxOutput) => {
            switch (output.kind) {
              case "P2PKH":
                return output.pkh
              case "P2SH":
                return output.sh
              default:
                return ""
            }
          })

          computedTxs.push(buildComputedTransaction("to", output.value, addresses, tx.locktime, tx.height))
        })
    })
  })

  //Object.values(transactions).forEach((tx) => {
  //  // Outputs to other people
  //  const outputs = tx.vout.reduce((acc: any, output: TxOutput) => {
  //    const castedOutput = output as P2PKHTxOutput
  //    if (inAccount(account, castedOutput.pkh)) {
  //      acc.ours.push(output)
  //    } else {
  //      acc.others.push(output)
  //    }
  //  }, { others: [], ours: [] } as any)
  //})

  return computedTxs
}

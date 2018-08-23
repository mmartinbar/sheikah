import { inAccount } from "app/common/factories/transactions"
import {
    walletFixture,
    transactionsFixture
} from "./transactions.fixtures"

describe("Transactions runtime types", () => {
    it("should find an existing pkh in a prefilled wallet", () => {
        const wallet = walletFixture
        const transactions = transactionsFixture

        const output = transactions.tx2id.vout[0]
        switch (output.kind) {
            case "P2PKH":
                expect(inAccount(wallet.accounts[0], output.pkh)).toBe(true)
                break
            default:
                break
        }
    })

    it("should not find an invented pkh in a prefilled wallet", () => {
        const wallet = walletFixture
        const transactions = transactionsFixture

        const output = transactions.tx2id.vout[0]
        switch (output.kind) {
            case "P2PKH":
                expect(inAccount(wallet.accounts[0], "invented id")).toBe(false)
                break
            default:
                break
        }
    })
})
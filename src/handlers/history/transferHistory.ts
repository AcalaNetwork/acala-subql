import { forceToCurrencyName } from "@acala-network/sdk-core"
import { AccountId, CurrencyId } from "@acala-network/types/interfaces"
import { Balance, Transfer } from "../../types"
import { ensureAccount } from "../account"
import { ensureCallExist } from "../call"
import { getNativeToken, getToken } from "../tokens"
import { DispatchedCallData, EventHandler } from "../types"

export const createTransferInCurrencies: EventHandler = async ({ event, rawEvent }) => {
    const [currency, from, to, amount] = rawEvent.event.data as unknown as [CurrencyId, AccountId, AccountId, any];
    
    const tokenName = forceToCurrencyName(currency);

    await getToken(tokenName)
	await ensureAccount(from.toString())
	await ensureAccount(to.toString())

    const transfer = new Transfer(`${rawEvent.block.block.header.number}-${rawEvent.event.index}-${from.toString()}-${to.toString()}-${rawEvent.block.timestamp}`)

    transfer.amount = amount.toString()
    transfer.timestamp = rawEvent.block.timestamp
    transfer.isSuccess = true
    transfer.toId = to.toString()
    transfer.fromId = from.toString()
    transfer.tokenId = tokenName

    await transfer.save()
}
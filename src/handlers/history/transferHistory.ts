import { CurrencyId } from "@acala-network/types/interfaces"
import { Transfer } from "../../types"
import { ensureAccount } from "../account"
import { ensureCallExist } from "../call"
import { getNativeToken, getToken } from "../tokens"
import { DispatchedCallData } from "../types"

export async function createTransferInCurrencies ({ call, extrinsic, rawCall }: DispatchedCallData) {
    const args = rawCall.args

    await ensureCallExist(call.id)

    const currencyId = args[1] as unknown as CurrencyId;

    const to = await ensureAccount(args[0].toString())
    const from = await ensureAccount(extrinsic.signerId)
    const token = await getToken(currencyId);

    const amount = (args[2] as any).toString()
    const extrinsicHash = extrinsic.id
    const transfer = new Transfer(call.id)

    transfer.amount = amount
    transfer.timestamp = extrinsic.timestamp
    transfer.isSuccess = call.isSuccess
    transfer.toId = to.id
    transfer.fromId = from.id
    transfer.tokenId = token.id
    transfer.extrinsicId = extrinsicHash
    transfer.callId = call.id

    await transfer.save()
}

export async function createTranserInBalances({ call, extrinsic, rawCall }: DispatchedCallData) {
    const args = rawCall.args

    await ensureCallExist(call.id)

    const token = await getNativeToken()
    const to = await ensureAccount(args[0].toString())
    const from = await ensureAccount(extrinsic.signerId)

    const amount = (args[1] as any).toString()
    const extrinsicHash = extrinsic.id
    const transfer = new Transfer(call.id)

    transfer.amount = amount
    transfer.timestamp = extrinsic.timestamp
    transfer.isSuccess = call.isSuccess
    transfer.toId = to.id
    transfer.fromId = from.id
    transfer.tokenId = token.id
    transfer.extrinsicId = extrinsicHash
    transfer.callId = call.id

    await transfer.save()
}
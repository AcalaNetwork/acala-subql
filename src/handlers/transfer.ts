import { Call, Transfer } from "../types"
import { ensureAccount } from "./account"
import { updateAccountAsset } from "./asset"
import { ensureCallExist } from "./call"
import { ensuerExtrinsic } from "./extrinsic"
import { getToken, getNativeToken } from "./tokens"
import { DispatchedCallData } from "./types"
import { getTokenName } from "./utils/token"

export async function createTransferInCurrencies ({ call, extrinsic, rawCall }: DispatchedCallData) {
    const args = rawCall.args

    await ensureCallExist(call.id)
    const token = await getToken(getTokenName(args[1]))
    const to = await ensureAccount(args[0].toString())
    const from = await ensureAccount(extrinsic.signerId)

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

    await updateAccountAsset(from.id, token.symbol, transfer.timestamp.getTime());
    await updateAccountAsset(to.id, token.symbol, transfer.timestamp.getTime());
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

    await updateAccountAsset(from.id, token.symbol, transfer.timestamp.getTime());
    await updateAccountAsset(to.id, token.symbol, transfer.timestamp.getTime());
    await transfer.save()
}
import { Call, Transfer } from "../types"
import { ensureAccount } from "./account"
import { updateAccountAsset } from "./asset"
import { ensureCallExist } from "./call"
import { createExtrinsic } from "./extrinsic"
import { upsertToken, getNativeToken } from "./tokens"
import { DispatchedCallData } from "./types"
import { getTokenName } from "./utils/token"

export async function createTransferInCurrencies ({ id, call, extrinsic, isSuccess }: DispatchedCallData) {
    const args = call.args

    const extrinsicData = await createExtrinsic(extrinsic)
    const token = await upsertToken(getTokenName(args[1]))
    const to = await ensureAccount(args[0].toString())
    const from = await ensureAccount(extrinsicData.signerId)

    await ensureCallExist(id)

    const amount = (args[2] as any).toString()
    const extrinsicHash = extrinsicData.id

    const transfer = new Transfer(id)

    transfer.amount = amount
    transfer.timestamp = extrinsicData.timestamp

    transfer.isSuccess = isSuccess
    transfer.toId = to.id
    transfer.fromId = from.id
    transfer.tokenId = token.id
    transfer.extrinsicId = extrinsicHash
    transfer.callId = id

    await updateAccountAsset(from.id, token.symbol, transfer.timestamp.getTime());
    await updateAccountAsset(to.id, token.symbol, transfer.timestamp.getTime());
    await transfer.save()
}

export async function createTranserInBalances({ id, call, extrinsic, isSuccess }: DispatchedCallData) {
    const args = call.args

    const extrinsicData = await createExtrinsic(extrinsic)
    const token = await getNativeToken()
    const to = await ensureAccount(args[0].toString())
    const from = await ensureAccount(extrinsicData.signerId)

    await ensureCallExist(id)

    const amount = (args[1] as any).toString()
    const extrinsicHash = extrinsicData.id

    const transfer = new Transfer(id)

    transfer.amount = amount
    transfer.timestamp = extrinsicData.timestamp

    transfer.isSuccess = isSuccess
    transfer.toId = to.id
    transfer.fromId = from.id
    transfer.tokenId = token.id
    transfer.extrinsicId = extrinsicHash
    transfer.callId = id

    await updateAccountAsset(from.id, token.symbol, transfer.timestamp.getTime());
    await updateAccountAsset(to.id, token.symbol, transfer.timestamp.getTime());
    await transfer.save()
}
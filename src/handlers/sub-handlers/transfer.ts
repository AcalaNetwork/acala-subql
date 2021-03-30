import { SubstrateEvent, SubstrateExtrinsic } from '@subql/types';
import { Transfer } from "../../types/models/Transfer";
import { AccountHandler } from './account';
import { TokenHandler } from './token';

export class TransferHandler {


  static async createFromCurrenciesModule (event: SubstrateEvent) {
    const data = event.event.data;

    const token = data[0].toString()
    const from = data[1].toString()
    const to = data[2].toString()
    const amount = (data[3] as any).toBigInt() || BigInt(0)

    const index = event.event.index.toString()
    const extrinsicHash = event?.extrinsic?.extrinsic?.hash.toString()
    const isSigned = event?.extrinsic?.extrinsic?.isSigned

    if (!isSigned) return

    await AccountHandler.ensureAccount(to)
    await AccountHandler.ensureAccount(from)
    await TokenHandler.ensureToken(token)

    const transfer = new Transfer(`${extrinsicHash}-${index}`)

    transfer.toId = to
    transfer.fromId = from
    transfer.tokenId = token
    transfer.amount = amount

    if (extrinsicHash && extrinsicHash !== 'null') {
      transfer.extrinsicId = extrinsicHash
    }

    await transfer.save()
  }
}
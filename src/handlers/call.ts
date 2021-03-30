import type { CallBase, AnyTuple } from '@polkadot/types/types'
import type { Vec } from '@polkadot/types'
import { SubstrateExtrinsic } from '@subql/types'
import { Call } from '../types/models/Call'
import { ExtrinsicHandler } from './extrinsic'
import { AccountHandler } from './sub-handlers/account'
import { Dispatcher, DispatcherHandler } from '../helpers/dispatcher'

export type AnyCall = CallBase<AnyTuple>

type CallDispatcher = Dispatcher<AnyCall>

export class CallHandler {
  private extrinsic: SubstrateExtrinsic
  private dispatcher: CallDispatcher

  static async ensureParentCall (id: string) {
    const call = await Call.get(id)

    if (!call) {
      await new Call(id).save()
    }
  }

  constructor(extrinsic: SubstrateExtrinsic) {
    this.extrinsic = extrinsic
    this.dispatcher = new Dispatcher<AnyCall>()

    this.registerSubHandler()
  }

  private registerSubHandler () {}

  get hash(): string {
    return this.extrinsic.extrinsic.hash.toString()
  }

  get signer(): string {
    return this.extrinsic.extrinsic.signer.toString()
  }

  private async traver(): Promise<Call[]> {
    const list = []

    await AccountHandler.ensureAccount(this.signer)

    const inner = async (
      data: AnyCall,
      parentCallId: string,
      idx: number,
      isRoot: boolean
    ) => {
      const id = isRoot ? parentCallId : `${parentCallId}-${idx}`
      const method = data.method
      const section = data.section
      const args = data.args

      const call = new Call(id)
      call.method = method
      call.section = section
      call.args = args.toString()
      call.signerId = this.signer

      if (!isRoot) {
        await CallHandler.ensureParentCall(parentCallId)

        call.parentCallId = isRoot ? '' : parentCallId

        call.extrinsicId = parentCallId.split('-')[0]
      } else {
        await ExtrinsicHandler.ensureExtrinsic(parentCallId)

        call.extrinsicId = parentCallId
      }

      list.push(call)

      if (section === 'utility' && (method === 'batch' || method === 'batchAll')) {
        const temp = args[0] as unknown as Vec<AnyCall>

        await Promise.all(temp.map((item, idx) => inner(item, id, idx, false)))
      }
    }

    await inner(
      this.extrinsic.extrinsic.method,
      this.hash,
      0,
      true
    )

    return list
  }

  public async save () {
    const calls = await this.traver()

    await Promise.all(calls.map(async (item) => item.save()));
  }
}

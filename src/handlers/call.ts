import type { CallBase, AnyTuple } from '@polkadot/types/types'
import type { Vec } from '@polkadot/types'
import { SubstrateExtrinsic } from '@subql/types'
import { Call } from '../types/models/Call'
import { ExtrinsicHandler } from './extrinsic'

export class CallHandler {
  private extrinsic: SubstrateExtrinsic

  static async ensureParentCall (id: string) {
    const call = await Call.get(id)

    if (!call) {
      await new Call(id).save()
    }
  }

  constructor(extrinsic: SubstrateExtrinsic) {
    this.extrinsic = extrinsic
  }

  get hash(): string {
    return this.extrinsic.extrinsic.hash.toString()
  }

  private async traver(): Promise<Call[]> {
    const list = []
    const rootHash = this.hash

    const inner = async (
      data: CallBase<AnyTuple>,
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

      if (!isRoot) {
        await CallHandler.ensureParentCall(parentCallId)

        call.parentCallId = isRoot ? '' : parentCallId
      } else {
        await ExtrinsicHandler.ensureExtrinsic(parentCallId)

        call.extrinsicId = parentCallId
      }

      list.push(call)

      if (section === 'utility' && (method === 'batch' || method === 'batchAll')) {
        const temp = args[0] as unknown as Vec<CallBase<AnyTuple>>

        await Promise.all(temp.map((item, idx) => inner(item, id, idx, false)))
      }
    }

    await inner(this.extrinsic.extrinsic.method, this.hash, 0, true)

    return list
  }



  public async save () {
    const calls = await this.traver()

    await Promise.all(calls.map(async (item) => item.save()));
  }
}

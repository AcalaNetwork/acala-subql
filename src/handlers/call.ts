import type { Vec } from '@polkadot/types'
import { SubstrateExtrinsic } from '@subql/types'
import { Call } from '../types/models/Call'
import { ExtrinsicHandler } from './extrinsic'
import { AccountHandler } from './sub-handlers/account'
import { Dispatcher } from '../helpers/dispatcher'
import { TransferHandler } from './sub-handlers/transfer'
import { LoanHandler } from './sub-handlers/loan'
import { AnyCall, CallDispatcher, DispatchedCallData } from './types'


export class CallHandler {
  private extrinsic: SubstrateExtrinsic
  private dispatcher: CallDispatcher

  static async ensureCall (id: string) {
    const call = await Call.get(id)

    if (!call) {
      await new Call(id).save()
    }
  }

  constructor(extrinsic: SubstrateExtrinsic) {
    this.extrinsic = extrinsic
    this.dispatcher = new Dispatcher<DispatchedCallData>()

    this.registerSubHandler()
  }

  private registerSubHandler () {
    this.dispatcher.batchRegist([
      {
        key: 'currencies-transfer',
        handler: TransferHandler.createFromCurrenciesModule
      },
      {
        key: 'honzon-adjustLoan',
        handler: LoanHandler.createLoanAction
      }
    ])
  }

  get hash(): string {
    return this.extrinsic.extrinsic.hash.toString()
  }

  get signer(): string {
    return this.extrinsic.extrinsic.signer.toString()
  }

  private async traver(): Promise<Call[]> {
    const list = []

    await AccountHandler.ensureAccount(this.signer)
    const extrinsic = new ExtrinsicHandler(this.extrinsic)

    const inner = async (
      data: AnyCall,
      parentCallId: string,
      idx: number,
      isRoot: boolean,
      depth: number
    ) => {
      const id = isRoot ? parentCallId : `${parentCallId}-${idx}`
      const method = data.method
      const section = data.section
      const args = data.args

      const call = new Call(id)
      call.method = method
      call.section = section
      call.args = JSON.stringify(args)
      call.signerId = this.signer
      call.isSuccess = depth === 0 ? extrinsic.isSuccess : extrinsic.batchInterruptedIndex > idx;
      call.timestamp = extrinsic.timestamp

      if (!isRoot) {
        await CallHandler.ensureCall(parentCallId)

        call.parentCallId = isRoot ? '' : parentCallId

        call.extrinsicId = parentCallId.split('-')[0]
      } else {
        await ExtrinsicHandler.ensureExtrinsic(parentCallId)

        call.extrinsicId = parentCallId
      }

      list.push(call)

      await this.dispatcher.dispatch(
        `${call.section}-${call.method}`,
        {
          id: call.id,
          call: data,
          extrinsic: this.extrinsic,
          isSuccess: call.isSuccess
        }
      )

      if (depth < 1 && section === 'utility' && (method === 'batch' || method === 'batchAll')) {
        const temp = args[0] as unknown as Vec<AnyCall>

        await Promise.all(temp.map((item, idx) => inner(item, id, idx, false, depth + 1)))
      } 
    }

    await inner(this.extrinsic.extrinsic.method, this.hash, 0, true, 0)

    return list
  }

  public async save () {
    const calls = await this.traver()

    await Promise.all(calls.map(async (item) => item.save()));
  }
}

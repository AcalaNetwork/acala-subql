import { SubstrateExtrinsic } from '@subql/types'
import { Extrinsic } from '../types/models/Extrinsic'
import { CallHandler } from './call'
import { ensureBlock } from './utils'

export class ExtrinsicHandler {
  private extrinsic: SubstrateExtrinsic

  static async ensureExtrinsic(id: string): Promise<void> {
    const extrinsic = await Extrinsic.get(id)
  
    if (!extrinsic) {
      await new Extrinsic(id).save()
    }
  }

  constructor(extrinsic: SubstrateExtrinsic) {
    this.extrinsic = extrinsic
  }

  get id(): string {
    return this.extrinsic?.extrinsic?.hash?.toString()
  }

  get method(): string {
    return this.extrinsic.extrinsic.method.method
  }

  get section(): string {
    return this.extrinsic.extrinsic.method.section
  }

  get args(): string {
    return this.extrinsic?.extrinsic?.args?.toString()
  }

  get signer(): string {
    return this.extrinsic?.extrinsic?.signer?.toString()
  }

  get nonce(): bigint {
    return this.extrinsic?.extrinsic?.nonce?.toBigInt() || BigInt(0)
  }

  get timestamp(): Date {
    return this.extrinsic.block.timestamp
  }

  get blockHash(): string {
    return this.extrinsic?.block?.block?.hash?.toString()
  }

  get isSigned(): boolean {
    return this.extrinsic.extrinsic.isSigned
  }

  get signature(): string {
    return this.extrinsic.extrinsic.signature.toString()
  }

  get tip(): bigint {
    return this.extrinsic.extrinsic.tip.toBigInt() || BigInt(0)
  }

  public async save () {
    const record = new Extrinsic(this.id)

    await ensureBlock(this.blockHash)

    record.method = this.method
    record.section = this.section
    record.args = this.args
    record.signer = this.signer
    record.nonce = this.nonce
    record.isSigned = this.isSigned
    record.timestamp = this.timestamp
    record.signature = this.signature
    record.tip = this.tip

    record.blockId = this.blockHash

    await record.save()

    // handle calls
    const calls = new CallHandler(this.extrinsic)

    await calls.save()
  }
}

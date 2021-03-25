import { SubstrateEvent } from '@subql/types'
import { Event } from '../types/models/Event'
import { ensureBlock, ensureExtrinsic } from './utils'

export class EventHandler {
  private event: SubstrateEvent 

  constructor(event: SubstrateEvent) {
    this.event = event
  }

  get index () {
    return this.event.idx
  }

  get blockNumber () {
    return this.event.block.block.header.number.toBigInt()
  }

  get blockHash () {
    return this.event.block.block.hash.toString()
  }

  get section () {
    return this.event.event.section
  }

  get method () {
    return this.event.event.method
  }

  get data () {
    return this.event.event.data.toString()
  }

  get extrinsicHash () {
    const i = this.event?.extrinsic?.extrinsic?.hash?.toString()

    return i === 'null' ? undefined : i
  }

  get id () {
    return `${this.blockNumber}-${this.index}`
  }

  public async save () {
    const event = new Event(this.id)

    await ensureBlock(this.blockHash)

    if (this.extrinsicHash) {
      await ensureExtrinsic(this.extrinsicHash)
    }

    event.index = this.index
    event.section = this.section
    event.method = this.method
    event.data = this.data

    event.blockId = this.blockHash

    if (this.extrinsicHash) {
      event.extrinsicId = this.extrinsicHash;
    }

    await event.save()
  }
}

import { SignedBlock } from '@polkadot/types/interfaces'
import { SubstrateEvent } from '@subql/types'
import { getBlockTimestamp } from '../helpers'
import { Event } from '../types/models/Event'

export class EventHandler {
  private event: SubstrateEvent 

  constructor(event: SubstrateEvent) {
    this.event = event
  }

  get index () {
    return this.event.idx;
  }

  get blockNumber () {
    return this.event.block.block.header.number.toBigInt()
  }

  get blockHash () {
    return this.event.block.hash.toString()
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
    return this.event?.extrinsic?.extrinsic?.hash?.toString() || ''
  }

  get id () {
    return `${this.blockNumber}-${this.index}`;
  }

  public async save () {
    const event = new Event(this.id)

    event.blockNumber = this.blockNumber
    event.blockHash = this.blockHash
    event.extrinsicHash = this.extrinsicHash

    event.index = this.index
    event.section = this.section
    event.method = this.method
    event.data = this.data

    await event.save()
  }
}
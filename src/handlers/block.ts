import { SignedBlock } from '@polkadot/types/interfaces'
import { getBlockTimestamp } from '../helpers'
import { Block } from '../types/models/Block'

export class BlockHandler {
  private block: SignedBlock

  constructor(block: SignedBlock) {
    this.block = block
  }

  get blockTimestamp () {
    return getBlockTimestamp(this.block.block)
  }

  get blockNumber () {
    return this.block.block.header.number.toBigInt()
  }

  get blockHash () {
    return this.block.hash.toString()
  }

  public async save () {
    const block = new Block(this.blockHash)

    block.blockNumber = this.blockNumber
    block.blockHash = this.blockHash
    block.timestamp = this.blockTimestamp

    await block.save()
  }
}
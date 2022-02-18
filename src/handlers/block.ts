import { SubstrateBlock } from '@subql/types';
import { Block } from '../types/models/Block'

export async function ensureBlock (block: SubstrateBlock) {
  const id = block.hash.toString();

  let record = await Block.get(id)

  if (!record) {
    record = new Block(id);

    record.timestamp = block.timestamp;
    record.number = block.block.header.number.toBigInt();
    record.parentHash = block.block.header.parentHash.toString();
    record.specVersion = block.specVersion.toString();
    record.extrinsicRoot = block.block.header.extrinsicsRoot.toString();
    record.stateRoot = block.block.header.stateRoot.toString();

    await record.save();
  }

  return record;
}
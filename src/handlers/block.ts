import { SubstrateBlock } from '@subql/types'
import { getBlockTimestamp } from './utils/getBlockTimestamp'
import { Block } from '../types/models'
import { initSystemConsts } from './system'
import { initSystemTokens } from './tokens'

let isFirstSync = true

export async function ensureBlock (block: SubstrateBlock) {
  const recordId = block.block.hash?.toString()

  let data = await Block.get(recordId)

  if (!data) {
    data = new Block(recordId)

    await data.save()
  }

  return data
}
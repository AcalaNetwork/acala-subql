import { Block } from '../types/models/Block'
import { Extrinsic } from '../types/models/Extrinsic'

export async function ensureBlock (id: string): Promise<void> {
  const block = await Block.get(id)

  if (!block) {
    await new Block(id).save()
  }
}

export async function ensureExtrinsic(id: string): Promise<void> {
  const extrinsic = await Extrinsic.get(id)

  if (!extrinsic) {
    await new Extrinsic(id).save()
  }
}

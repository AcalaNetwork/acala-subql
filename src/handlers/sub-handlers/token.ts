import { SubstrateExtrinsic } from '@subql/types'
import { resolveToken } from '../../helpers/token'
import { Token } from '../../types/models/Token'
import { Transfer } from "../../types/models/Transfer"
import { AnyCall } from '../types'
import { AccountHandler } from './account'

export class TokenHandler {
  static async ensureToken (id: string, decimal?: number) {
    const token = await Token.get(id)

    if (!token) {
      const token = new Token(id)

      token.name = id
      token.decimal = decimal

      await token.save()
    }
  }
}
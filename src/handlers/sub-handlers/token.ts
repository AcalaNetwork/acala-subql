import { SubstrateExtrinsic } from '@subql/types';
import { Token } from '../../types/models/Token';
import { Transfer } from "../../types/models/Transfer";
import { AnyCall } from '../call';
import { AccountHandler } from './account';

export class TokenHandler {
  static async ensureToken (id: string) {
    const token = await Token.get(id)

    if (!token) {
      await new Token(id).save()
    }
  }

  static async createToken (id: string, name: string, decimal: number) {
    await this.ensureToken(id)

    const token = await Token.get(id)

    token.name = name
    token.decimal = decimal

    await token.save()
  }
}
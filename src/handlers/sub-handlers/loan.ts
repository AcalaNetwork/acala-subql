import { ExchangeRate, Position } from '@acala-network/types/interfaces';
import { Option } from '@polkadot/types';
import { SubstrateExtrinsic } from '@subql/types';
import { getPrice } from '../../helpers';
import { resolveToken, TOKEN_DECIMAL } from '../../helpers/token';
import { Call } from '../../types/models/Call';
import { LoanAction } from '../../types/models/LoanAction';

import { LoanPosition } from "../../types/models/LoanPosition";
import { CallHandler } from '../call';
import { ExtrinsicHandler } from '../extrinsic';
import { DispatchedCallData } from '../types';
import { AccountHandler } from './account';
import { TokenHandler } from './token';

export class LoanHandler {
  static async ensurePosition (id: string) {
    const position = await LoanPosition.get(id)

    if (!position) {
      const position = new LoanPosition(id)

      await position.save()

      return position
    }

    return position
  }

  static async getExchangeRate (token: string) {
    const exchangeRate = await (api.query.cdpEngine.debitExchangeRate({ Token: token }) as unknown as Promise<Option<ExchangeRate>>)
    const defaultExchangeRate = api.consts.cdpEngine.defaultDebitExchangeRate as unknown as ExchangeRate

    return exchangeRate.isSome ? exchangeRate.unwrapOrDefault().toBigInt() : defaultExchangeRate.toBigInt()
  }

  static async updatePosition (token: string, account: string) {
    const id = `${account}-${token}`
    const position = await LoanHandler.ensurePosition(id)

    const data = await (api.query.loans.positions([{ Token: token }, account]) as unknown as Promise<Position>)
    
    position.accountId = account
    position.tokenId = token

    position.collateral = data.collateral.toBigInt()
    position.debit = data.debit.toBigInt()

    await position.save()
  }

  static async createLoanAction ({ id, call, extrinsic, isSuccess }: DispatchedCallData) {
    const args = call.args
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)
    const action = new LoanAction(id)
    const token = resolveToken(args[0])
    const exchangeRate = await LoanHandler.getExchangeRate(token.name)
    
    await TokenHandler.ensureToken(token.name, token.decimal)
    await AccountHandler.ensureAccount(extrinsicHandler.signer)
    await ExtrinsicHandler.ensureExtrinsic(extrinsicHandler.id)
    await CallHandler.ensureCall(id)

    await LoanHandler.updatePosition(token.name, extrinsicHandler.signer)

    action.accountId = extrinsicHandler.signer
    action.tokenId = token.name
    action.collateral = (args[1] as any).toBigInt()
    action.debit = (args[2] as any).toBigInt()

    action.exchangeRate = exchangeRate
    action.extrinsicId = extrinsicHandler.id
    action.callId = id
    action.timestamp = extrinsicHandler.timestamp
    action.isSuccess = isSuccess

    await action.save()
  } 
}
import { SubstrateEvent } from '@subql/types'
import { Dispatcher } from './utils/dispatcher'
import { ensureBlock } from './block'
import { Event } from '../types'
import { getKVData } from './utils'
import { ensuerExtrinsic } from './extrinsic'
import { DispatchedEventData } from './types'
import { createAddLiquidityHistory, createAddProvisionHistory, createRemoveLiquidityHistory, createSwapHistory } from './dexHistory'
import { createConfiscateCollateralAndDebitHistory, createPositionUpdatedHistory, createTransferLoanHistory } from './loanHistory';
import { createClaimRewards, createDepositDexShareHistory, createWithdrawDexShareHistory } from './incentiveHistory'
import { createMintLiquidHistory, createRedeemByClaimUnbonding, createRedeemByFreeUnbonded, createRedeemByUnbondHistory } from './homaHistory'


const dispatch = new Dispatcher<DispatchedEventData>()

dispatch.batchRegist([
  // loan
  { key: 'loans-PositionUpdated', handler: createPositionUpdatedHistory },
  { key: 'loans-ConfiscateCollateralAndDebit', handler: createConfiscateCollateralAndDebitHistory },
  { key: 'loans-transferLoan', handler: createTransferLoanHistory },

  // dex
  { key: 'dex-Swap', handler: createSwapHistory },
  { key: 'dex-AddProvision', handler: createAddProvisionHistory },
  { key: 'dex-AddLiquidity', handler: createAddLiquidityHistory },
  { key: 'dex-RemoveLiquidity', handler: createRemoveLiquidityHistory },

  // incentive
  { key: 'incentives-DepositDexShare', handler: createDepositDexShareHistory },
  { key: 'incentives-WithdrawDexShare', handler: createWithdrawDexShareHistory },
  { key: 'incentives-ClaimRewards', handler: createClaimRewards },

  // homa
  { key: 'stakingPool-MintLiquid', handler: createMintLiquidHistory },
  { key: 'stakingPool-RedeemByUnbond', handler: createRedeemByUnbondHistory },
  { key: 'stakingPool-RedeemByFreeUnbonded', handler: createRedeemByFreeUnbonded },
  { key: 'stakingPool-RedeemByClaimUnbonding', handler: createRedeemByClaimUnbonding },
])

export async function ensureEvnet (event: SubstrateEvent) {
  const block = await ensureBlock(event.block)

  const idx = event.idx
  const recordId = `${block.number}-${idx}`

  let data = await Event.get(recordId)

  if (!data) {
    data = new Event(recordId)
    data.index = idx
    data.blockId = block.id

    await data.save()
  }

  return data
}

export async function createEvent (event: SubstrateEvent) {
  const extrinsic = await (event.extrinsic ? ensuerExtrinsic(event.extrinsic) : undefined)

  const data = await ensureEvnet(event)

  const section = event.event.section
  const method = event.event.method
  const eventData = getKVData(event.event.data)
  
  data.section = section
  data.method = method
  data.data = eventData

  if(extrinsic) {
    data.extrinsicId = extrinsic.id
  }

  await dispatch.dispatch(`${section}-${data.method}`, { event: data, rawEvent: event } )

  await data.save()

  return data
}

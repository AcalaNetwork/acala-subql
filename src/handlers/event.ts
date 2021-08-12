import { SubstrateEvent } from '@subql/types'
import { Dispatcher } from './utils/dispatcher'
import { ensureBlock } from './block'
import { Event } from '../types/models/Event'
import { getKVData } from './utils'
import { ensuerExtrinsic } from './extrinsic'
import { DispatchedEventData } from './types'
import { createAddLiquidityHistory, createAddProvisionHistory, createRemoveLiquidityHistory, createSwapHistory } from './dexHistory'
import { createConfiscateCollateralAndDebitHistory, createLiquidateUnsafeCDPHistory, createPositionUpdatedHistory, createTransferLoanHistory } from './loanHistory';
import { createClaimRewards, createDepositDexShareHistory, createWithdrawDexShareHistory } from './incentiveHistory'
import { createMintLiquidHistory, createRedeemByClaimUnbonding, createRedeemByFreeUnbonded, createRedeemByUnbondHistory } from './homaHistory'
import { updateLoanPosition, updateTotalLoanPosition, updateLoanPositionByLiquidate, updateTotalLoanPositionByLiquidate } from './loanPosition'
import { handleProvisioningToEnabled } from './dex/pool'
// import { updateBalanceByDeposit, updateBalanceByTransferred, updateBalanceByUpdate, updateBalanceByWithdrawn } from './balance'
// import { updateCrossedKSM } from './summary'


const dispatch = new Dispatcher<DispatchedEventData>()

dispatch.batchRegist([
  // currencies
  // { key: 'currencies-BalanceUpdated', handler: updateBalanceByUpdate },
  // { key: 'currencies-Deposited', handler: updateBalanceByDeposit },
  // { key: 'currencies-Withdrawn', handler: updateBalanceByWithdrawn },
  // { key: 'currencies-Transferred', handler: updateBalanceByTransferred },
  // { key: 'currencies-Withdrawn', handler: updateCrossedKSM },
  // { key: 'currencies-Transferred', handler: updateCrossedKSM },

  // loan
  { key: 'loans-PositionUpdated', handler: createPositionUpdatedHistory },
  { key: 'loans-PositionUpdated', handler: updateLoanPosition },
  { key: 'loans-PositionUpdated', handler: updateTotalLoanPosition },
  { key: 'loans-ConfiscateCollateralAndDebit', handler: createConfiscateCollateralAndDebitHistory },
  { key: 'loans-transferLoan', handler: createTransferLoanHistory },
  { key: 'cdpEngine-LiquidateUnsafeCDP', handler: createLiquidateUnsafeCDPHistory },
  { key: 'cdpEngine-LiquidateUnsafeCDP', handler: updateLoanPositionByLiquidate },
  { key: 'cdpEngine-LiquidateUnsafeCDP', handler: updateTotalLoanPositionByLiquidate },

  // dex
  { key: 'dex-Swap', handler: createSwapHistory },
  { key: 'dex-AddProvision', handler: createAddProvisionHistory },
  { key: 'dex-AddLiquidity', handler: createAddLiquidityHistory },
  { key: 'dex-RemoveLiquidity', handler: createRemoveLiquidityHistory },
  { key: 'dex-ProvisioningToEnable', handler: handleProvisioningToEnabled },

  // incentive
  { key: 'incentives-DepositDexShare', handler: createDepositDexShareHistory },
  { key: 'incentives-WithdrawDexShare', handler: createWithdrawDexShareHistory },
  { key: 'incentives-PayoutRewards', handler: createClaimRewards },

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
    data.blockNumber = block.number
    data.timestamp = block.timestamp

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

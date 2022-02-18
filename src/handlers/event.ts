import { SubstrateEvent } from "@subql/types";
import { Dispatcher } from "./utils/dispatcher";
import { Event } from "../types/models";
import { getKVData } from "./utils";
import { DispatchedEventData } from "./types";
import {
  createMintLiquidHistory,
  createRedeemByClaimUnbonding,
  createRedeemByFreeUnbonded,
  createRedeemByUnbondHistory,
  createConfiscateCollateralAndDebitHistory,
  createLiquidateUnsafeCDPHistory,
  createPositionUpdatedHistory,
  createTransferLoanHistory,
  createClaimRewards,
  createDepositDexShareHistory,
  createWithdrawDexShareHistory,
  createHomaLiteMintHistory,
  createNFTTransferHistory,
  createNFTBurnedHistory,
  createNFTBurnedWithRemarkHistory,
  createHomaLiteRedeemRequestHistory,
  createHomaLiteRedeemedHistory,
  createHomaLiteRedeemCancelHistory,
  handleHomaMinted,
  handleHomaRequestedRedeem,
  handleHomaRequestedCancelled,
  handleHomaRedeemedByFastMatch,
  handleHomaRedeemedByUnbond,
  createTransferInCurrencies,
} from "./history";
import { createDexPool, updatePoolByAddLiquidity, updatePoolByRemoveLiquidity, updatePoolBySwap } from "./dex/pool";
import {
  createProvision,
  updateProvisionByEnable,
  updateUserProvision,
} from "./dex/provision";
import {
  handleGlobalInterestRatePerSecUpdated,
  handleInterestRatePerSecUpdated,
  handleLiquidationPenaltyUpdated,
  handleLiquidationRatioUpdated,
  handleMaximumTotalDebitValueUpdated,
  handleRequiredCollateralRatioUpdated,
  updateLoanPosition,
  updateLoanPositionByLiquidate,
  handleCloseLoanHasDebitByDex,
} from "./loan/position";
import { ensureCallExist } from "./call";
import { ensureExtrinsic } from "./extrinsic";
import { ensureBlock } from "./block";
// import { updateBalanceByTransferred } from "./balance";
// import { updateCrossedKSM } from './summary'

const dispatch = new Dispatcher<DispatchedEventData>();

dispatch.batchRegist([
  // currencies
  // { key: 'currencies-BalanceUpdated', handler: updateBalanceByUpdate },
  // { key: 'currencies-Deposited', handler: updateBalanceByDeposit },
  // { key: 'currencies-Withdrawn', handler: updateBalanceByWithdrawn },
  // { key: 'currencies-Transferred', handler: updateBalanceByTransferred },
  // { key: 'currencies-Withdrawn', handler: updateCrossedKSM },
  // { key: 'currencies-Transferred', handler: updateCrossedKSM },

  { key: 'currencies-Transferred', handler: createTransferInCurrencies },

  // nft
  { key: "nft-TransferredToken", handler: createNFTTransferHistory },
  { key: "nft-BurnedToken", handler: createNFTBurnedHistory },
  { key: "nft-BurnedTokenWithRemark", handler: createNFTBurnedWithRemarkHistory },

  // loan
  { key: "loans-PositionUpdated", handler: createPositionUpdatedHistory },
  { key: "loans-PositionUpdated", handler: updateLoanPosition },
  { key: "loans-ConfiscateCollateralAndDebit", handler: createConfiscateCollateralAndDebitHistory },
  { key: "loans-transferLoan", handler: createTransferLoanHistory },

  // // all cdp params config update
  { key: "cdpEngine-InterestRatePerSecUpdated", handler: handleInterestRatePerSecUpdated, },
  { key: "cdpEngine-LiquidationRatioUpdated", handler: handleLiquidationRatioUpdated, },
  { key: "cdpEngine-LiquidationPenaltyUpdated", handler: handleLiquidationPenaltyUpdated, },
  { key: "cdpEngine-RequiredCollateralRatioUpdated", handler: handleRequiredCollateralRatioUpdated, },
  { key: "cdpEngine-MaximumTotalDebitValueUpdated", handler: handleMaximumTotalDebitValueUpdated, },
  { key: "cdpEngine-GlobalInterestRatePerSecUpdated", handler: handleGlobalInterestRatePerSecUpdated, },
  { key: "cdpEngine-LiquidateUnsafeCDP", handler: createLiquidateUnsafeCDPHistory },
  { key: "cdpEngine-LiquidateUnsafeCDP", handler: updateLoanPositionByLiquidate },
  { key: "honzon-CloseLoanHasDebitByDex", handler: handleCloseLoanHasDebitByDex},

  // // dex
  { key: "dex-ProvisioningToEnabled", handler: createDexPool },
  { key: "dex-AddLiquidity", handler: updatePoolByAddLiquidity },
  { key: "dex-RemoveLiquidity", handler: updatePoolByRemoveLiquidity },
  { key: "dex-Swap", handler: updatePoolBySwap },

  // // provision
  { key: "dex-ListProvision", handler: createProvision },
  { key: "dex-ProvisioningToEnabled", handler: updateProvisionByEnable },
  { key: "dex-AddProvision", handler: updateUserProvision },

  // // incentive
  { key: "incentives-DepositDexShare", handler: createDepositDexShareHistory },
  { key: "incentives-WithdrawDexShare", handler: createWithdrawDexShareHistory },
  { key: "incentives-PayoutRewards", handler: createClaimRewards },
  { key: "incentives-ClaimRewards", handler: createClaimRewards },

  // homa lite
  { key: 'homaLite-Minted', handler: createHomaLiteMintHistory },
  { key: 'homaLite-RedeemRequestCancelled', handler: createHomaLiteRedeemCancelHistory },
  { key: 'homaLite-RedeemRequested', handler: createHomaLiteRedeemRequestHistory },
  { key: 'homaLite-Redeemed', handler: createHomaLiteRedeemedHistory },

  // homa
  { key: 'homa-Minted', handler: handleHomaMinted },
  { key: 'homa-RequestedRedeem', handler: handleHomaRequestedRedeem},
  { key: 'homa-RedeemRequestCancelled', handler: handleHomaRequestedCancelled},
  { key: 'homa-RedeemedByFastMatch', handler: handleHomaRedeemedByFastMatch},
  { key: 'homa-RedeemedByUnbond', handler: handleHomaRedeemedByUnbond },

  // { key: "stakingPool-MintLiquid", handler: createMintLiquidHistory },
  // { key: "stakingPool-RedeemByUnbond", handler: createRedeemByUnbondHistory },
  // { key: "stakingPool-RedeemByFreeUnbonded", handler: createRedeemByFreeUnbonded },
  // { key: "stakingPool-RedeemByClaimUnbonding", handler: createRedeemByClaimUnbonding },
]);

export async function ensureEvnet(event: SubstrateEvent) {
  const idx = event.idx;
  const recordId = `${event.block.block.header.number}-${idx}`;

  let data = await Event.get(recordId);

  if (!data) {
    data = new Event(recordId);
    data.index = idx;
    data.blockNumber = event.block.block.header.number.toBigInt();
    data.timestamp = event.block.timestamp;
  }

  return data;
}

export async function createEvent(event: SubstrateEvent) {
  const data = await ensureEvnet(event);
  const block = await ensureBlock(event.block);

  const section = event.event.section;
  const method = event.event.method;
  const eventData = getKVData(event.event.data);

  data.section = section;
  data.method = method;
  data.data = eventData;
  data.blockId = block.id;

  if (event.extrinsic.extrinsic.hash.toString()) {
    const call = await ensureExtrinsic(event.extrinsic);

    data.extrinsicId = call.id;
  }

  await dispatch.dispatch(`${section}-${data.method}`, {
    event: data,
    rawEvent: event,
  });

  await data.save();

  return data;
}

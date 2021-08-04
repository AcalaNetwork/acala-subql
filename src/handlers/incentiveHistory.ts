import {  EventHandler } from "./types";
import { IncentiveAction } from "../types/models/IncentiveAction";
import { ensureAccount } from "./account";
import { mapUpdateKVData } from "./utils/updateKVData";

export const createDepositDexShareHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new IncentiveAction(event.id);

  record.type = 'DepositDexShare';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [
      { key: 'account' },
      { key: 'DexShare' },
      { key: 'Amount'}
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createWithdrawDexShareHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new IncentiveAction(event.id);

  record.type = 'WithdrawDexShare';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [
      { key: 'account' },
      { key: 'DexShare' },
      { key: 'Amount'},
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createClaimRewards: EventHandler = async ({ event, rawEvent }) => {
  const record = new IncentiveAction(event.id);

  record.type = 'PayoutRewards';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [
      { key: 'account' },
      { key: 'PoolId' },
      { key: 'rewardCurrency' },
      { key: 'acturalPayout' },
      { key: 'deductionAmount' },
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

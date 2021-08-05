import {  EventHandler } from "./types";
import { DexAction } from "../types/models/DexAction";
import { ensureAccount } from "./account";
import { mapUpdateKVData } from "./utils/updateKVData";

export const createSwapHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new DexAction(event.id);

  record.type = 'swap';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [{ key: 'account' }, { key: 'path' }, { key: 'supplyAmount'}, { key: 'targetAmount' }];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createAddLiquidityHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new DexAction(event.id);

  record.type = 'addLiquidity';
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
      { key: 'currency1' },
      { key: 'amount1'},
      { key: 'currency2' },
      { key: 'amount2' },
      { key: 'share' },
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createRemoveLiquidityHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new DexAction(event.id);

  record.type = 'addProvision';
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
      { key: 'currency1' },
      { key: 'amount1'},
      { key: 'currency2' },
      { key: 'amount2' },
      { key: 'share' }
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createAddProvisionHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new DexAction(event.id);

  record.type = 'addProvision';
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
      { key: 'currency1' },
      { key: 'amount1'},
      { key: 'currency2' },
      { key: 'amount2' }
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

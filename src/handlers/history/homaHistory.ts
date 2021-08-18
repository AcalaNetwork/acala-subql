import {  EventHandler } from "../types";
import { ensureAccount } from "../account";
import { mapUpdateKVData } from "../utils/updateKVData";
import { HomaAction } from "../../types/models";

export const createMintLiquidHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new HomaAction(event.id);

  record.type = 'MintLiquid';
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
      { key: 'depositedStakingAmount' },
      { key: 'receivedLiquidAmount'}
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createRedeemByUnbondHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new HomaAction(event.id);

  record.type = 'RedeemByUnbond';
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
      { key: 'burnedLiquidAmount' },
      { key: 'redeemedStakingAmount'},
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createRedeemByFreeUnbonded: EventHandler = async ({ event, rawEvent }) => {
  const record = new HomaAction(event.id);

  record.type = 'RedeemByFreeUnbonded';
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
      { key: 'burnedLiquidAmount' },
      { key: 'redeemedStakingAmount'},
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createRedeemByClaimUnbonding: EventHandler = async ({ event, rawEvent }) => {
  const record = new HomaAction(event.id);

  record.type = 'RedeemByClaimUnbonding';
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
      { key: 'targetEra' },
      { key: 'stakingAmountOfFee'},
      { key: 'burnedLiquidAmount'},
      { key: 'redeemedStakingAmount'},
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

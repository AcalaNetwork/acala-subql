import {  EventHandler } from "../types";
import { ensureAccount } from "../account";
import { mapUpdateKVData } from "../utils/updateKVData";
import { NFTAction } from "../../types/models/NFTAction";

export const createNFTTransferHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new NFTAction(event.id);

  record.type = 'TransferredToken';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [
      { key: 'from' },
      { key: 'to' },
      { key: 'classId'},
      { key: 'tokenId' }
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createNFTBurnedHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new NFTAction(event.id);

  record.type = 'BurnedToken';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [
      { key: 'owner' },
      { key: 'classId' },
      { key: 'tokenId'}
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createNFTBurnedWithRemarkHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new NFTAction(event.id);

  record.type = 'BurnedTokenWithRemark';
  record.extrinsicId = event.extrinsicId;
  record.timestamp = rawEvent.block.timestamp;

  if (rawEvent.values) {
    const [account] = rawEvent.event.data;

    const accountRecord = await ensureAccount(account.toString());

    record.accountId = accountRecord.id;
  }

  if (event.data) {
    const keyArray = [
      { key: 'owner' },
      { key: 'classId' },
      { key: 'tokenId'},
      { key: 'remarkHash'},
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

import {  EventHandler } from "./types";
import { LoanAction, Account } from "../types/models";
import { ensureAccount } from "./account";
import { mapUpdateKVData } from "./utils/updateKVData";

export const createPositionUpdatedHistory: EventHandler =  async ({ event, rawEvent }) => {
  const record = new LoanAction(event.id);

  record.type = 'PositionUpdated';
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
      { key: 'collateral' },
      { key: 'collateralAdjustment'},
      { key: 'debitAdjustment' }
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  if (rawEvent.event.data) {
    const [_, collateral] = rawEvent.event.data;

    // save the debit exchange rate
    if (collateral) {
      const dexbitExchangeRate = await (api.query.cdpEngine.debitExchangeRate as any)(collateral)

      record.data.push({
        key: 'debitExchangeRate',
        type: 'Option<ExchangeRate>',
        value: dexbitExchangeRate
      });
    }
  }

  await record.save();
}

export const createConfiscateCollateralAndDebitHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new LoanAction(event.id);

  record.type = 'ConfiscateCollateralAndDebit';
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
      { key: 'collateral' },
      { key: 'collateralAdjustment'},
      { key: 'debitValueAdjustment' },
    ];
    record.data = mapUpdateKVData(event.data, keyArray);
  }

  await record.save();
}

export const createTransferLoanHistory: EventHandler = async ({ event, rawEvent }) => {
  const fromRecord = new LoanAction(event.id + '-from');
  const toRecord = new LoanAction(event.id + '-to');

  const updateRecord = (record: LoanAction, accountRecord: Account) =>  {
    record.type = 'TransferLoan';
    record.extrinsicId = event.extrinsicId;
    record.timestamp = rawEvent.block.timestamp;

    if (rawEvent.values) {
      record.accountId = accountRecord.id;
    }

    if (event.data) {
      const keyArray = [
        { key: 'form' },
        { key: 'to' },
        { key: 'collateral'},
      ];
      record.data = mapUpdateKVData(event.data, keyArray);
    }
  }

  fromRecord.subType = 'transfer'
  toRecord.subType = 'receive'

  if (rawEvent.event.data) {
    const [from, to] = rawEvent.event.data;

    const fromAccount = await ensureAccount(from.toString());
    const toAccount = await ensureAccount(to.toString());

    updateRecord(fromRecord, fromAccount);
    updateRecord(toRecord, toAccount);
  }

  await fromRecord.save();
  await toRecord.save();
}

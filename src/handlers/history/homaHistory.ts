import { EventHandler } from "../types";
import { ensureAccount } from "../account";
import { mapUpdateKVData } from "../utils/updateKVData";
import { HomaAction } from "../../types/models";

export const createHomaLiteMintHistory: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "Minted";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "amountStaked" },
			{ key: "amountMinted" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createHomaLiteRedeemRequestHistory: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	/// \[who, liquid_amount, extra_fee\]
	record.type = "RedeemRequest";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "liquidAmount" },
			{ key: "extraFee" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createHomaLiteRedeemedHistory: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	/// \[user, staking_amount_redeemed, liquid_amount_deducted\]
	record.type = "Redeemed";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "redeemedAmount" },
			{ key: "deductedLiquidAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createHomaLiteRedeemCancelHistory: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	/// \[who, liquid_amount_unreserved\]
	record.type = "RedeemRequestCancelled";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [{ key: "account" }, { key: "cancelAmount" }];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createMintLiquidHistory: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "MintLiquid";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "depositedStakingAmount" },
			{ key: "receivedLiquidAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createRedeemByUnbondHistory: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemByUnbond";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "burnedLiquidAmount" },
			{ key: "redeemedStakingAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createRedeemByFreeUnbonded: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemByFreeUnbonded";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "burnedLiquidAmount" },
			{ key: "redeemedStakingAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const createRedeemByClaimUnbonding: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemByClaimUnbonding";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "account" },
			{ key: "targetEra" },
			{ key: "stakingAmountOfFee" },
			{ key: "burnedLiquidAmount" },
			{ key: "redeemedStakingAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const handleHomaMinted: EventHandler = async ({ event, rawEvent }) => {
	const record = new HomaAction(event.id);

	record.type = "Minted";
	record.subType = 'homa';
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "minter" },
			{ key: "stakingCurrencyAmount" },
			{ key: "liquidAmountReceived" },
			{ key: "liquidAmountAddToVoid" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const handleHomaRequestedRedeem: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemRequest";
	record.subType = 'homa';
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "redeemer" },
			{ key: "liquidAmount" },
			{ key: "allowFastMatch" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const handleHomaRequestedCancelled: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemRequestedCancelled";
	record.subType = 'homa';
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [{ key: "redeemer" }, { key: "cancelledLiquidAmount" }];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const handleHomaRedeemedByFastMatch: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemedByFastMatch";
	record.subType = 'homa';
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "redeemer" },
			{ key: "matchedLiquidAmount" },
			{ key: "feeInLiquid" },
			{ key: "redeemedStakingAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const handleHomaRedeemedByUnbond: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "RedeemedByUnbond";
  record.subType = "homa";
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [
			{ key: "redeemer" },
			{ key: "eraIndexWhenUnbond" },
			{ key: "liquidAmount" },
			{ key: "unbondingStakingAmount" },
		];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

export const handleHomaWithdrawRedemption: EventHandler = async ({
	event,
	rawEvent,
}) => {
	const record = new HomaAction(event.id);

	record.type = "WithdrawRedemption";
	record.subType = 'homa';
	record.extrinsicId = event.extrinsicId;
	record.timestamp = rawEvent.block.timestamp;

	if (rawEvent.values) {
		const [account] = rawEvent.event.data;

		const accountRecord = await ensureAccount(account.toString());

		record.accountId = accountRecord.id;
	}

	if (event.data) {
		const keyArray = [{ key: "redeemer" }, { key: "redemptionAmount" }];
		record.data = mapUpdateKVData(event.data, keyArray);
	}

	await record.save();
};

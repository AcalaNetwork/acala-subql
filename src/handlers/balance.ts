import { TotalBalance } from "../types/models";

async function getTotalBalanceOrDefaultRecord (token: string) {
	const current = await TotalBalance.get(token);

	if (!current) {
		const record = TotalBalance.create(token);

		return record;
	}

	return current;
}

export async function updateTotalBalance (token: string, changed: string, ) {
	const record = await getTotalBalanceOrDefaultRecord(token);

}
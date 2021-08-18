import { Dex } from "../../types";

export async function getDex () {
	let record = await Dex.get('1')

	if (!record) {
		record = new Dex('1')

		record.poolCount = 0
		record.totalTVLUSD = '0'
		record.totalVolumeUSD = ''

		await record.save()
	}

	return record
}

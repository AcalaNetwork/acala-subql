import { forceToCurrencyId } from "@acala-network/sdk-core"
import { Option } from "@polkadot/types"
import { TimestampedValueOf } from "@open-web3/orml-types/interfaces"
import { PriceBundle } from "../../types/models"

export async function getPricesBundle () {
	const record = await PriceBundle.get('1')

	if (!record) {
		const record = new PriceBundle('1')

		record.ksm = '0'

		await record.save()

		return record
	}

	return record
}

export async function updatePricesBundle () {
	const record = await getPricesBundle()

	const rawKSMPrice = await api.query.acalaOracle.values(forceToCurrencyId(api, 'KSM')) as  Option<TimestampedValueOf>

	record.ksm = rawKSMPrice.unwrapOrDefault().value.toString() || '0'

	record.save()
}

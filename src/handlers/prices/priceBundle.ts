import { FixedPointNumber, forceToCurrencyId, forceToCurrencyIdName, MaybeCurrency } from "@acala-network/sdk-core"
import { PriceBundle } from "../../types/models"
import { getPool } from "../dex/pool"

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

export async function getKSMPrice () {
	const pool = await getPool('KUSD', 'KSM')

	if (!pool) return FixedPointNumber.ZERO

	return FixedPointNumber.fromInner(pool.exchange0)
}

export async function getKARPrice () {
	const pool = await getPool('KAR', 'KSM')
	const ksmPrice = await getKSMPrice()

	if (!pool) return FixedPointNumber.ZERO

	return FixedPointNumber.fromInner(pool.exchange1).mul(ksmPrice)
}

export async function getTokenPrice (token: string) {
	const pool = await getPool('KUSD', token)

	if (!pool) return FixedPointNumber.ZERO

	return FixedPointNumber.fromInner(pool.exchange1);
}


export async function getPrice (token: MaybeCurrency) {
	const name = forceToCurrencyIdName(token)

	switch (name) {
		case 'KSM': return getKSMPrice()
		case 'KAR': return getKARPrice()
		default: return getTokenPrice(name)
	}
}
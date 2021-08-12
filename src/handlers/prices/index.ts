import { FixedPointNumber, MaybeCurrency, forceToCurrencyIdName } from '@acala-network/sdk-core' 
import { getPool } from '../dex/pool';
import { getToken } from '../tokens';
import { getPricesBundle } from "./priceBundle";

 // get KAR price from KSM-KAR pair
export async function getKARPrice () {
	// get KAR-KSM pool
	const pool = await getPool('KAR', 'KSM')

	return FixedPointNumber.fromInner(pool.token0Price)
}

// get KSM price from oracle
export async function getKSMPrice () {
	const bundle = await getPricesBundle()

	return FixedPointNumber.fromInner(bundle.ksm)
}

// get KUSD price as $1
export function getKUSDPrice () {
	return FixedPointNumber.ONE
}

export async function getPrice (name: MaybeCurrency) {
	const _name = forceToCurrencyIdName(name)

	if (_name === 'KSUD' || _name === 'AUSD') return getKUSDPrice()

	if(_name === 'KSM') return getKSMPrice()

	if (_name === 'KAR') return getKARPrice()

	const token = await getToken(name)

	return FixedPointNumber.fromInner(token.price || '0')
}
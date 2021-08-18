import { FixedPointNumber, MaybeCurrency, forceToCurrencyIdName } from '@acala-network/sdk-core' 
import { getPool } from '../dex/pool';
import { getToken } from '../tokens';

async function getPriceFromDexPool (tokenA: string, tokenB: string) {
	const pool = await getPool(tokenA, tokenB)

	if (!pool) return FixedPointNumber.ZERO

	const token0 = await getToken(pool.token0Id)
	const token1 = await getToken(pool.token1Id)

	const amount0 = FixedPointNumber.fromInner(pool.token0Amount || '0', token0.decimal)
	const amount1 = FixedPointNumber.fromInner(pool.token1Amount || '0', token1.decimal)

	if (amount0.isZero()) return FixedPointNumber.ZERO

	return pool.token0Id === tokenA ? amount0.div(amount1) : amount1.div(amount0)
}
 // get KAR price from KSM-KAR pair
export async function getKARPrice () {
	// get KAR-KSM pool
	const karKSMPrice = await getPriceFromDexPool('KAR', 'KSM')
	const ksmPrice = await getKSMPrice()

	return karKSMPrice.mul(ksmPrice)
}

export async function getKSMPrice () {
	return getPriceFromDexPool('KSM', 'KUSD')
}

// get KUSD price as $1
export function getKUSDPrice () {
	return new FixedPointNumber(1, 12)
}

export async function getPrice (name: MaybeCurrency) {
	const _name = forceToCurrencyIdName(name)

	if (_name === 'KUSD' || _name === 'AUSD') return getKUSDPrice()

	if(_name === 'KSM') return getKSMPrice()

	if (_name === 'KAR') return getKARPrice()

	return getPriceFromDexPool(_name, 'KUSD')
}

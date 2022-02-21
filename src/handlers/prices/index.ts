import { FixedPointNumber, MaybeCurrency, forceToCurrencyName, Token } from '@acala-network/sdk-core' 
import { getPool } from '../dex/pool';
import { getToken } from '../tokens';

async function getPriceFromDexPool (tokenA: string, tokenB: string) {
	const [_t0, _t1] = Token.sortTokenNames(tokenA, tokenB);
	const token0 = await getToken(_t0)
	const token1 = await getToken(_t1)
	const pool = await getPool(tokenA, tokenB)

	if (!pool) return FixedPointNumber.ZERO

	const amount0 = FixedPointNumber.fromInner(pool.token0Amount || '0', token0.decimal)
	const amount1 = FixedPointNumber.fromInner(pool.token1Amount || '0', token1.decimal)

	if (amount0.isZero()) return FixedPointNumber.ZERO

	return pool.token0Id === tokenA ? amount1.div(amount0) : amount0.div(amount1)
}
 // get KAR price from KSM-KAR pair
export async function getKARPrice () {
	// get KAR-KSM pool
	const karKSMPrice = await getPriceFromDexPool('KAR', 'KSM')
	const ksmPrice = await getKSMPrice()

	return karKSMPrice.mul(ksmPrice)
}

export async function getLKSMPrice () {
	// get KSM-LKSM pool
	const lksmKSMPrice = await getPriceFromDexPool('LKSM', 'KSM')
	const ksmPrice = await getKSMPrice()

	return lksmKSMPrice.mul(ksmPrice)
}

export async function getKSMPrice () {
	return getPriceFromDexPool('KSM', 'KUSD')
}

// get KUSD price as $1
export function getKUSDPrice () {
	return new FixedPointNumber(1, 12)
}

export async function getDOTPrice () {
	// get ACA-LC://13 pool
	const dotLCPrice = await getPriceFromDexPool('DOT', 'lc://13')
	const lc13Price = await getLC13Price()

	return dotLCPrice.mul(lc13Price)
}

export async function getACAPrice () {
	// get ACA-LC://13 pool
	const acalaPrice = await getPriceFromDexPool('ACA', 'AUSD')

	return acalaPrice
}

export async function getLC13Price () {
	return getPriceFromDexPool('lc://13', 'AUSD')
}

export async function getPrice (name: MaybeCurrency) {
	const _name = forceToCurrencyName(name)

	if (_name === 'KUSD' || _name === 'AUSD') return getKUSDPrice()

	if(_name === 'KSM') return getKSMPrice()

	if (_name === 'KAR') return getKARPrice()

	if (_name === 'LKSM') return getLKSMPrice()

	if(_name === 'DOT') return getDOTPrice()

	if(_name === 'ACA') return getACAPrice()

	if(_name === 'lc://13') return getLC13Price()

	return getPriceFromDexPool(_name, 'KUSD')
}

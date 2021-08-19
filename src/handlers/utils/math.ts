import { FixedPointNumber } from '@acala-network/sdk-core'

function getFN (num: string | FixedPointNumber, decimal?: number) {
	if (!num) return FixedPointNumber.ZERO

	if (Number.isNaN(num) || num === 'NaN') return FixedPointNumber.ZERO

	if(typeof num === 'string') return FixedPointNumber.fromInner(num, decimal)

	return num
}

export function add (a: string | FixedPointNumber, b: string | FixedPointNumber, decimalA?: number, decimalB?: number) {
	return getFN(a, decimalA).add(getFN(b, decimalB));
}

export function minus(a: string, b: string, decimalA?: number, decimalB?: number) {
	return getFN(a, decimalA).minus(getFN(b, decimalB));
}

export function div(a: string, b: string, decimalA?: number, decimalB?: number) {
	return getFN(a, decimalA).div(getFN(b, decimalB));
}

export function mul(a: string, b: string, decimalA?: number, decimalB?: number) {
	return getFN(a, decimalA).mul(getFN(b, decimalB));
}
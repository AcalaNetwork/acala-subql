import { FixedPointNumber } from '@acala-network/sdk-core'

export function add (a: string, b: string, decimalA?: number, decimalB?: number) {
	return FixedPointNumber.fromInner(a, decimalA).add(FixedPointNumber.fromInner(b, decimalB))
}

export function minus(a: string, b: string, decimalA?: number, decimalB?: number) {
	return FixedPointNumber.fromInner(a, decimalA).minus(FixedPointNumber.fromInner(b, decimalB))
}
import { FixedPointNumber } from '@acala-network/sdk-core'

export function add (a: string, b: string, decimalA?: number, decimalB?: number) {
	return FixedPointNumber.fromInner(a || 0, decimalA).add(FixedPointNumber.fromInner(b || 0, decimalB))
}

export function minus(a: string, b: string, decimalA?: number, decimalB?: number) {
	return FixedPointNumber.fromInner(a || 0, decimalA).minus(FixedPointNumber.fromInner(b || 0, decimalB))
}
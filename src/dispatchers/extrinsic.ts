import type { SubstrateExtrinsic } from '@subql/types'
import { Call } from '@polkadot/types/interfaces'

import { CallData, ExtrinsicExecutor, ExtrinsicData } from '../extrinsic-executors/types'
import { getBatchInterruptedIndex, mapExtrinsic } from '../helpers/extrinsic'

export class ExtrinsicDispatcher {
    private executors: Map<string, ExtrinsicExecutor[]>

    constructor () {
        this.executors = new Map()
    }

    private getExecutorKey (section: string, method: string) {
        return `${section}-${method}`;
    }

    public addExecutor (section: string, method: string, executor: ExtrinsicExecutor) {
        const key = this.getExecutorKey(section, method);

        if (this.executors.get(key)) {
            const list = this.executors.get(key);

            list.push(executor);
        } else {
            this.executors.set(key, [executor]);
        }
    }

    public async dispatch (extrinsic: SubstrateExtrinsic) {
        const { extrinsic: _extrinsic } = extrinsic
        const { method, section, args } = _extrinsic.method;

        switch (`${section}_${method}`) {
            case 'utility_batch': {
                return this.batchExecutor(extrinsic)
            }

            case 'utility_batchAll': {
                this.batchExecutor(extrinsic)
                break
            }

            case 'sudo_sudo': {
                this.sudoExecutor(extrinsic)

                break
            }

            default: {
                const callData = { section, method, args }

                return this._dispatch(callData, mapExtrinsic(extrinsic))
            }
        }
    }

    private async _dispatch (
        call: CallData,
        extrinsic: ExtrinsicData,
    ) {
        const { section, method } = call
        const key = this.getExecutorKey(section, method)
        const executors = this.executors.get(key)

        if (executors) {
            await Promise.all(executors.map(executor => executor(call, extrinsic)))
        }
    }

    private batchExecutor (extrinsic: SubstrateExtrinsic) {
        const { extrinsic: _extrinsic } = extrinsic

        const calls = _extrinsic.args[0] as unknown as Call[]
        const batchInterruptedIndex = getBatchInterruptedIndex(extrinsic)

        return Promise.all(calls.map(async (call, index) => {
            const { section, method, args } = call

            const callData = { section, method, args, batchIndex: index };
            const extrinsicData = mapExtrinsic(extrinsic)

            let isExcuteSuccess = extrinsicData.isExcuteSuccess

            if (isExcuteSuccess && batchInterruptedIndex >= 0) {
                isExcuteSuccess = index < batchInterruptedIndex
            }

            return this._dispatch(
                callData,
                {
                    ...extrinsicData,
                    isExcuteSuccess
                }
            )
        }))
    }

    private sudoExecutor (extrinsic: SubstrateExtrinsic) {
        const { extrinsic: _extrinsic } = extrinsic
        const call = _extrinsic.args[0] as Call
        const { section, method, args } = call
        const callData = { section, method, args };

        return this._dispatch(callData, mapExtrinsic(extrinsic))
    }
}
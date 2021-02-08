import type { SubstrateExtrinsic } from '@subql/types'

import { ExtrinsicHandler, ExtrinsicInfo } from '../handlers/types'
import { checkIfExtrinsicSuccess } from '../helpers/extrinsic'

export class ExtrinsicDispatcher {
    private handlers: Map<string, ExtrinsicHandler>

    constructor () {
        this.handlers = new Map()
    }

    public add (section: string, method: string, callback: ExtrinsicHandler) {
        this.handlers.set(`${section}_${method}`, callback)
    }

    public emit (extrinsic: SubstrateExtrinsic) {
        const { extrinsic: _extrinsic } = extrinsic
        const { method, section } = _extrinsic.method;

        switch (section) {
            case 'utility': {
                const { data } = _extrinsic

                for (const item of data) {
                    console.log(item.toString())
                }

                break;
            }

            case 'sudo': {
                this.sudoHandler(extrinsic)

                break;
            }

            default: {
                return this._emit(section, method, extrinsic)
            }
        }
    }

    private _emit (
        section: string,
        method: string,
        extrinsic: SubstrateExtrinsic,
        info?: ExtrinsicInfo
    ) {
        const key = `${section}_${method}`
        const handler = this.handlers.get(key)
        const isSuccess = checkIfExtrinsicSuccess(extrinsic)

        if (handler) handler(extrinsic, { ...info, isSuccess })
    }

    private sudoHandler (extrinsic: SubstrateExtrinsic) {

    }
}
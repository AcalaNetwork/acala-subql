// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class LoanAction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public isBatch: number;

    public isSudo: number;

    public isSuccess: number;

    public block: string;

    public extrinsicHash: string;

    public timestamp: Date;

    public account: string;

    public token: string;

    public collateralAdjustment: bigint;

    public debitAdjustment: bigint;

    public debitExchangeRate: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanAction entity without an ID");
        await store.set('LoanAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanAction entity without an ID");
        await store.remove('LoanAction', id.toString());
    }

    static async get(id:string): Promise<LoanAction>{
        assert(id !== null, "Cannot get LoanAction entity without an ID");
        const record = await store.get('LoanAction', id.toString());
        if (record){
            return LoanAction.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new LoanAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

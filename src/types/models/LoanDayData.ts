// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class LoanDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public token: string;

    public timestamp: Date;

    public collateral: bigint;

    public debit: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanDayData entity without an ID");
        await store.set('LoanDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanDayData entity without an ID");
        await store.remove('LoanDayData', id.toString());
    }

    static async get(id:string): Promise<LoanDayData>{
        assert(id !== null, "Cannot get LoanDayData entity without an ID");
        const record = await store.get('LoanDayData', id.toString());
        if (record){
            return LoanDayData.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new LoanDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

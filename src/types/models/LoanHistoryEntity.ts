// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class LoanHistoryEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public isBatch: number;

    public isSudo: number;

    public isSuccess: number;

    public block: string;

    public timestamp: Date;

    public account?: string;

    public currency: string;

    public collateralAdjustment: string;

    public debitAdjustment: string;

    public debitExchangeRate: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanHistoryEntity entity without an ID");
        await store.set('LoanHistoryEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanHistoryEntity entity without an ID");
        await store.remove('LoanHistoryEntity', id.toString());
    }

    static async get(id:string): Promise<LoanHistoryEntity>{
        assert(id !== null, "Cannot get LoanHistoryEntity entity without an ID");
        const record = await store.get('LoanHistoryEntity', id.toString());
        if (record){
            return LoanHistoryEntity.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new LoanHistoryEntity(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

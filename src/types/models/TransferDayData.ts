// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class TransferDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public date: number;

    public totalAmount: bigint;

    public token: string;

    public txCount: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TransferDayData entity without an ID");
        await store.set('TransferDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TransferDayData entity without an ID");
        await store.remove('TransferDayData', id.toString());
    }

    static async get(id:string): Promise<TransferDayData>{
        assert(id !== null, "Cannot get TransferDayData entity without an ID");
        const record = await store.get('TransferDayData', id.toString());
        if (record){
            return TransferDayData.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new TransferDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class SwapHistoryEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public isBatch: number;

    public isSudo: number;

    public isSuccess: number;

    public block: string;

    public timestamp: Date;

    public account: string;

    public type: string;

    public path: string;

    public params1: string;

    public params2: string;

    public supplyAmount?: string;

    public targetAmount?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SwapHistoryEntity entity without an ID");
        await store.set('SwapHistoryEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SwapHistoryEntity entity without an ID");
        await store.remove('SwapHistoryEntity', id.toString());
    }

    static async get(id:string): Promise<SwapHistoryEntity>{
        assert(id !== null, "Cannot get SwapHistoryEntity entity without an ID");
        const record = await store.get('SwapHistoryEntity', id.toString());
        if (record){
            return SwapHistoryEntity.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new SwapHistoryEntity(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class AddLiquidityHistoryEntity implements Entity {

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

    public token1: string;

    public token2: string;

    public token1MaxAmount: string;

    public token2MaxMaount: string;

    public token1Amount?: string;

    public token2Amount?: string;

    public receivedShare?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AddLiquidityHistoryEntity entity without an ID");
        await store.set('AddLiquidityHistoryEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AddLiquidityHistoryEntity entity without an ID");
        await store.remove('AddLiquidityHistoryEntity', id.toString());
    }

    static async get(id:string): Promise<AddLiquidityHistoryEntity>{
        assert(id !== null, "Cannot get AddLiquidityHistoryEntity entity without an ID");
        const record = await store.get('AddLiquidityHistoryEntity', id.toString());
        if (record){
            return AddLiquidityHistoryEntity.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new AddLiquidityHistoryEntity(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

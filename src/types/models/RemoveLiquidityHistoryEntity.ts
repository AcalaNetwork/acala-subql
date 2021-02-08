// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class RemoveLiquidityHistoryEntity implements Entity {

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

    public removedShare: string;

    public token1Amount?: string;

    public token2Amount?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save RemoveLiquidityHistoryEntity entity without an ID");
        await store.set('RemoveLiquidityHistoryEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove RemoveLiquidityHistoryEntity entity without an ID");
        await store.remove('RemoveLiquidityHistoryEntity', id.toString());
    }

    static async get(id:string): Promise<RemoveLiquidityHistoryEntity>{
        assert(id !== null, "Cannot get RemoveLiquidityHistoryEntity entity without an ID");
        const record = await store.get('RemoveLiquidityHistoryEntity', id.toString());
        if (record){
            return RemoveLiquidityHistoryEntity.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new RemoveLiquidityHistoryEntity(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

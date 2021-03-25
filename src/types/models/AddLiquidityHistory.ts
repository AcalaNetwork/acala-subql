// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class AddLiquidityHistory implements Entity {

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

    public token0: string;

    public token1: string;

    public token0Input: bigint;

    public token1Input: bigint;

    public token0Amount: bigint;

    public token1Amount: bigint;

    public receivedShare: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AddLiquidityHistory entity without an ID");
        await store.set('AddLiquidityHistory', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AddLiquidityHistory entity without an ID");
        await store.remove('AddLiquidityHistory', id.toString());
    }

    static async get(id:string): Promise<AddLiquidityHistory>{
        assert(id !== null, "Cannot get AddLiquidityHistory entity without an ID");
        const record = await store.get('AddLiquidityHistory', id.toString());
        if (record){
            return AddLiquidityHistory.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new AddLiquidityHistory(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

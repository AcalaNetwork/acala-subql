// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class Pair implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public token0: string;

    public token1: string;

    public totalSupply: bigint;

    public token0Volume: bigint;

    public token1Volume: bigint;

    public token0USD: bigint;

    public token1USD: bigint;

    public token0Price: bigint;

    public token1Price: bigint;

    public txCount: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Pair entity without an ID");
        await store.set('Pair', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Pair entity without an ID");
        await store.remove('Pair', id.toString());
    }

    static async get(id:string): Promise<Pair>{
        assert(id !== null, "Cannot get Pair entity without an ID");
        const record = await store.get('Pair', id.toString());
        if (record){
            return Pair.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new Pair(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

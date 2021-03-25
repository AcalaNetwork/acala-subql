// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class SwapAction implements Entity {

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

    public type: string;

    public path: string;

    public token0: string;

    public token1: string;

    public token0Input: string;

    public token1Input: string;

    public result: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SwapAction entity without an ID");
        await store.set('SwapAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SwapAction entity without an ID");
        await store.remove('SwapAction', id.toString());
    }

    static async get(id:string): Promise<SwapAction>{
        assert(id !== null, "Cannot get SwapAction entity without an ID");
        const record = await store.get('SwapAction', id.toString());
        if (record){
            return SwapAction.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new SwapAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

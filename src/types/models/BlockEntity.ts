// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class BlockEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public number: bigint;

    public timestamp: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BlockEntity entity without an ID");
        await store.set('BlockEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BlockEntity entity without an ID");
        await store.remove('BlockEntity', id.toString());
    }

    static async get(id:string): Promise<BlockEntity>{
        assert(id !== null, "Cannot get BlockEntity entity without an ID");
        const record = await store.get('BlockEntity', id.toString());
        if (record){
            return BlockEntity.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new BlockEntity(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class ExtrinsicEntity implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public hash: string;

    public author: string;

    public timestamp: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ExtrinsicEntity entity without an ID");
        await store.set('ExtrinsicEntity', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ExtrinsicEntity entity without an ID");
        await store.remove('ExtrinsicEntity', id.toString());
    }

    static async get(id:string): Promise<ExtrinsicEntity>{
        assert(id !== null, "Cannot get ExtrinsicEntity entity without an ID");
        const record = await store.get('ExtrinsicEntity', id.toString());
        if (record){
            return ExtrinsicEntity.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new ExtrinsicEntity(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

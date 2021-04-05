// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class Extrinsic implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public method?: string;

    public section?: string;

    public args?: string;

    public signerId?: string;

    public nonce?: bigint;

    public timestamp?: Date;

    public signature?: string;

    public tip?: bigint;

    public isSigned?: boolean;

    public isSuccess?: boolean;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Extrinsic entity without an ID");
        await store.set('Extrinsic', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Extrinsic entity without an ID");
        await store.remove('Extrinsic', id.toString());
    }

    static async get(id:string): Promise<Extrinsic>{
        assert(id !== null, "Cannot get Extrinsic entity without an ID");
        const record = await store.get('Extrinsic', id.toString());
        if (record){
            return Extrinsic.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new Extrinsic(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

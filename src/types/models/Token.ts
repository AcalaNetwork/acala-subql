// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class Token implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public decimal: number;

    public name: string;

    public totalIssued: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Token entity without an ID");
        await store.set('Token', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Token entity without an ID");
        await store.remove('Token', id.toString());
    }

    static async get(id:string): Promise<Token>{
        assert(id !== null, "Cannot get Token entity without an ID");
        const record = await store.get('Token', id.toString());
        if (record){
            return Token.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new Token(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

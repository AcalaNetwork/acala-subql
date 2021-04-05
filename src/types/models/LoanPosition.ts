// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class LoanPosition implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public tokenId?: string;

    public debit?: bigint;

    public collateral?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanPosition entity without an ID");
        await store.set('LoanPosition', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanPosition entity without an ID");
        await store.remove('LoanPosition', id.toString());
    }

    static async get(id:string): Promise<LoanPosition>{
        assert(id !== null, "Cannot get LoanPosition entity without an ID");
        const record = await store.get('LoanPosition', id.toString());
        if (record){
            return LoanPosition.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new LoanPosition(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

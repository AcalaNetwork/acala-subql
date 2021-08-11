// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'


export class DexAction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public type?: string;

    public subType?: string;

    public data?: KVData[];

    public extrinsicId?: string;

    public timestamp?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save DexAction entity without an ID");
        await store.set('DexAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove DexAction entity without an ID");
        await store.remove('DexAction', id.toString());
    }

    static async get(id:string): Promise<DexAction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get DexAction entity without an ID");
        const record = await store.get('DexAction', id.toString());
        if (record){
            return DexAction.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new DexAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

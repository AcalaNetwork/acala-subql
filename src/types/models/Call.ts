// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'


export class Call implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public section?: string;

    public method?: string;

    public args?: KVData[];

    public timestamp?: Date;

    public isSuccess?: boolean;

    public signerId?: string;

    public extrinsicId?: string;

    public parentCallId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Call entity without an ID");
        await store.set('Call', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Call entity without an ID");
        await store.remove('Call', id.toString());
    }

    static async get(id:string): Promise<Call | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Call entity without an ID");
        const record = await store.get('Call', id.toString());
        if (record){
            return Call.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Call(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

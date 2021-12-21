// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
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


    static async getBySignerId(signerId: string): Promise<Call[] | undefined>{
      
      const records = await store.getByField('Call', 'signerId', signerId);
      return records.map(record => Call.create(record));
      
    }

    static async getByExtrinsicId(extrinsicId: string): Promise<Call[] | undefined>{
      
      const records = await store.getByField('Call', 'extrinsicId', extrinsicId);
      return records.map(record => Call.create(record));
      
    }

    static async getByParentCallId(parentCallId: string): Promise<Call[] | undefined>{
      
      const records = await store.getByField('Call', 'parentCallId', parentCallId);
      return records.map(record => Call.create(record));
      
    }


    static create(record: Partial<Omit<Call, FunctionPropertyNames<Call>>> & Entity): Call {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Call(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

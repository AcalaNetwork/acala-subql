// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'




export class NFTAction implements Entity {

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
        assert(id !== null, "Cannot save NFTAction entity without an ID");
        await store.set('NFTAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NFTAction entity without an ID");
        await store.remove('NFTAction', id.toString());
    }

    static async get(id:string): Promise<NFTAction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NFTAction entity without an ID");
        const record = await store.get('NFTAction', id.toString());
        if (record){
            return NFTAction.create(record);
        }else{
            return;
        }
    }


    static async getByAccountId(accountId: string): Promise<NFTAction[] | undefined>{
      
      const records = await store.getByField('NFTAction', 'accountId', accountId);
      return records.map(record => NFTAction.create(record));
      
    }

    static async getByExtrinsicId(extrinsicId: string): Promise<NFTAction[] | undefined>{
      
      const records = await store.getByField('NFTAction', 'extrinsicId', extrinsicId);
      return records.map(record => NFTAction.create(record));
      
    }


    static create(record: Partial<Omit<NFTAction, FunctionPropertyNames<NFTAction>>> & Entity): NFTAction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new NFTAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

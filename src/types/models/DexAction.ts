// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
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

    public poolId?: string;

    public token0Id?: string;

    public token1Id?: string;

    public token0Amount?: string;

    public token1Amount?: string;

    public volumeUSD?: string;

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


    static async getByAccountId(accountId: string): Promise<DexAction[] | undefined>{
      
      const records = await store.getByField('DexAction', 'accountId', accountId);
      return records.map(record => DexAction.create(record));
      
    }

    static async getByPoolId(poolId: string): Promise<DexAction[] | undefined>{
      
      const records = await store.getByField('DexAction', 'poolId', poolId);
      return records.map(record => DexAction.create(record));
      
    }

    static async getByToken0Id(token0Id: string): Promise<DexAction[] | undefined>{
      
      const records = await store.getByField('DexAction', 'token0Id', token0Id);
      return records.map(record => DexAction.create(record));
      
    }

    static async getByToken1Id(token1Id: string): Promise<DexAction[] | undefined>{
      
      const records = await store.getByField('DexAction', 'token1Id', token1Id);
      return records.map(record => DexAction.create(record));
      
    }

    static async getByExtrinsicId(extrinsicId: string): Promise<DexAction[] | undefined>{
      
      const records = await store.getByField('DexAction', 'extrinsicId', extrinsicId);
      return records.map(record => DexAction.create(record));
      
    }


    static create(record: Partial<Omit<DexAction, FunctionPropertyNames<DexAction>>> & Entity): DexAction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new DexAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

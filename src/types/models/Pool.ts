// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class Pool implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public token0Id?: string;

    public token1Id?: string;

    public token0Amount?: string;

    public token1Amount?: string;

    public exchange0?: string;

    public exchange1?: string;

    public fee?: string;

    public token0Volume?: string;

    public token1Volume?: string;

    public volumeUSD?: string;

    public token0TVL?: string;

    public token1TVL?: string;

    public tvlUSD?: string;

    public txCount?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Pool entity without an ID");
        await store.set('Pool', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Pool entity without an ID");
        await store.remove('Pool', id.toString());
    }

    static async get(id:string): Promise<Pool | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Pool entity without an ID");
        const record = await store.get('Pool', id.toString());
        if (record){
            return Pool.create(record);
        }else{
            return;
        }
    }


    static async getByToken0Id(token0Id: string): Promise<Pool[] | undefined>{
      
      const records = await store.getByField('Pool', 'token0Id', token0Id);
      return records.map(record => Pool.create(record));
      
    }

    static async getByToken1Id(token1Id: string): Promise<Pool[] | undefined>{
      
      const records = await store.getByField('Pool', 'token1Id', token1Id);
      return records.map(record => Pool.create(record));
      
    }


    static create(record: Partial<Omit<Pool, FunctionPropertyNames<Pool>>> & Entity): Pool {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Pool(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

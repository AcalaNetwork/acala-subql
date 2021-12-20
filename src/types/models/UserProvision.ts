// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class UserProvision implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolId?: string;

    public token0Id?: string;

    public token1Id?: string;

    public token0Amount?: string;

    public token1Amount?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save UserProvision entity without an ID");
        await store.set('UserProvision', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove UserProvision entity without an ID");
        await store.remove('UserProvision', id.toString());
    }

    static async get(id:string): Promise<UserProvision | undefined>{
        assert((id !== null && id !== undefined), "Cannot get UserProvision entity without an ID");
        const record = await store.get('UserProvision', id.toString());
        if (record){
            return UserProvision.create(record);
        }else{
            return;
        }
    }


    static async getByPoolId(poolId: string): Promise<UserProvision[] | undefined>{
      
      const records = await store.getByField('UserProvision', 'poolId', poolId);
      return records.map(record => UserProvision.create(record));
      
    }

    static async getByToken0Id(token0Id: string): Promise<UserProvision[] | undefined>{
      
      const records = await store.getByField('UserProvision', 'token0Id', token0Id);
      return records.map(record => UserProvision.create(record));
      
    }

    static async getByToken1Id(token1Id: string): Promise<UserProvision[] | undefined>{
      
      const records = await store.getByField('UserProvision', 'token1Id', token1Id);
      return records.map(record => UserProvision.create(record));
      
    }


    static create(record: Partial<Omit<UserProvision, FunctionPropertyNames<UserProvision>>> & Entity): UserProvision {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new UserProvision(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

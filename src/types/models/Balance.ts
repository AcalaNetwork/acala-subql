// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class Balance implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public collateral?: string;

    public total?: string;

    public tokenId?: string;

    public balance?: string;

    public incentive?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Balance entity without an ID");
        await store.set('Balance', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Balance entity without an ID");
        await store.remove('Balance', id.toString());
    }

    static async get(id:string): Promise<Balance | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Balance entity without an ID");
        const record = await store.get('Balance', id.toString());
        if (record){
            return Balance.create(record);
        }else{
            return;
        }
    }


    static async getByAccountId(accountId: string): Promise<Balance[] | undefined>{
      
      const records = await store.getByField('Balance', 'accountId', accountId);
      return records.map(record => Balance.create(record));
      
    }

    static async getByTokenId(tokenId: string): Promise<Balance[] | undefined>{
      
      const records = await store.getByField('Balance', 'tokenId', tokenId);
      return records.map(record => Balance.create(record));
      
    }


    static create(record: Partial<Omit<Balance, FunctionPropertyNames<Balance>>> & Entity): Balance {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Balance(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

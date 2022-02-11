// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class BalanceChangedRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public tokenId?: string;

    public collateral?: string;

    public blockNumber?: bigint;

    public total?: string;

    public timestamp?: Date;

    public balance?: string;

    public incentive?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BalanceChangedRecord entity without an ID");
        await store.set('BalanceChangedRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BalanceChangedRecord entity without an ID");
        await store.remove('BalanceChangedRecord', id.toString());
    }

    static async get(id:string): Promise<BalanceChangedRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get BalanceChangedRecord entity without an ID");
        const record = await store.get('BalanceChangedRecord', id.toString());
        if (record){
            return BalanceChangedRecord.create(record);
        }else{
            return;
        }
    }


    static async getByAccountId(accountId: string): Promise<BalanceChangedRecord[] | undefined>{
      
      const records = await store.getByField('BalanceChangedRecord', 'accountId', accountId);
      return records.map(record => BalanceChangedRecord.create(record));
      
    }

    static async getByTokenId(tokenId: string): Promise<BalanceChangedRecord[] | undefined>{
      
      const records = await store.getByField('BalanceChangedRecord', 'tokenId', tokenId);
      return records.map(record => BalanceChangedRecord.create(record));
      
    }


    static create(record: Partial<Omit<BalanceChangedRecord, FunctionPropertyNames<BalanceChangedRecord>>> & Entity): BalanceChangedRecord {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new BalanceChangedRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

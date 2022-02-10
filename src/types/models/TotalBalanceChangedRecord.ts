// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class TotalBalanceChangedRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public balance?: string;

    public blockNumber?: bigint;

    public timestamp?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TotalBalanceChangedRecord entity without an ID");
        await store.set('TotalBalanceChangedRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TotalBalanceChangedRecord entity without an ID");
        await store.remove('TotalBalanceChangedRecord', id.toString());
    }

    static async get(id:string): Promise<TotalBalanceChangedRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TotalBalanceChangedRecord entity without an ID");
        const record = await store.get('TotalBalanceChangedRecord', id.toString());
        if (record){
            return TotalBalanceChangedRecord.create(record);
        }else{
            return;
        }
    }


    static async getByTokenId(tokenId: string): Promise<TotalBalanceChangedRecord[] | undefined>{
      
      const records = await store.getByField('TotalBalanceChangedRecord', 'tokenId', tokenId);
      return records.map(record => TotalBalanceChangedRecord.create(record));
      
    }


    static create(record: Partial<Omit<TotalBalanceChangedRecord, FunctionPropertyNames<TotalBalanceChangedRecord>>> & Entity): TotalBalanceChangedRecord {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new TotalBalanceChangedRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

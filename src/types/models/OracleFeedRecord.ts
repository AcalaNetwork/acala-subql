// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class OracleFeedRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public price?: string;

    public provider?: string;

    public accountId?: string;

    public blockNumber?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save OracleFeedRecord entity without an ID");
        await store.set('OracleFeedRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove OracleFeedRecord entity without an ID");
        await store.remove('OracleFeedRecord', id.toString());
    }

    static async get(id:string): Promise<OracleFeedRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get OracleFeedRecord entity without an ID");
        const record = await store.get('OracleFeedRecord', id.toString());
        if (record){
            return OracleFeedRecord.create(record);
        }else{
            return;
        }
    }


    static async getByTokenId(tokenId: string): Promise<OracleFeedRecord[] | undefined>{
      
      const records = await store.getByField('OracleFeedRecord', 'tokenId', tokenId);
      return records.map(record => OracleFeedRecord.create(record));
      
    }

    static async getByAccountId(accountId: string): Promise<OracleFeedRecord[] | undefined>{
      
      const records = await store.getByField('OracleFeedRecord', 'accountId', accountId);
      return records.map(record => OracleFeedRecord.create(record));
      
    }

    static async getByBlockId(blockId: string): Promise<OracleFeedRecord[] | undefined>{
      
      const records = await store.getByField('OracleFeedRecord', 'blockId', blockId);
      return records.map(record => OracleFeedRecord.create(record));
      
    }


    static create(record: Partial<Omit<OracleFeedRecord, FunctionPropertyNames<OracleFeedRecord>>> & Entity): OracleFeedRecord {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new OracleFeedRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

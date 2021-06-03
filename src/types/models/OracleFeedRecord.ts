// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class OracleFeedRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public accountId?: string;

    public provider?: string;

    public feedPrice?: string;

    public updateAtBlockId?: string;


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



    static create(record){
        let entity = new OracleFeedRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

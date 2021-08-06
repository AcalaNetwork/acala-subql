// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class TotalShareRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public amount?: string;

    public blockNumber?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TotalShareRecord entity without an ID");
        await store.set('TotalShareRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TotalShareRecord entity without an ID");
        await store.remove('TotalShareRecord', id.toString());
    }

    static async get(id:string): Promise<TotalShareRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TotalShareRecord entity without an ID");
        const record = await store.get('TotalShareRecord', id.toString());
        if (record){
            return TotalShareRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new TotalShareRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

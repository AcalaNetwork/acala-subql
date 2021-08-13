// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class PriceRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public ksm: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save PriceRecord entity without an ID");
        await store.set('PriceRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove PriceRecord entity without an ID");
        await store.remove('PriceRecord', id.toString());
    }

    static async get(id:string): Promise<PriceRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get PriceRecord entity without an ID");
        const record = await store.get('PriceRecord', id.toString());
        if (record){
            return PriceRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new PriceRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

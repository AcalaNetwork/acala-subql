// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class PriceBundle implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public ksm?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save PriceBundle entity without an ID");
        await store.set('PriceBundle', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove PriceBundle entity without an ID");
        await store.remove('PriceBundle', id.toString());
    }

    static async get(id:string): Promise<PriceBundle | undefined>{
        assert((id !== null && id !== undefined), "Cannot get PriceBundle entity without an ID");
        const record = await store.get('PriceBundle', id.toString());
        if (record){
            return PriceBundle.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new PriceBundle(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

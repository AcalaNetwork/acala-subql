// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Price implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public price?: string;

    public token?: string;

    public createAtBlockNumber?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Price entity without an ID");
        await store.set('Price', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Price entity without an ID");
        await store.remove('Price', id.toString());
    }

    static async get(id:string): Promise<Price | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Price entity without an ID");
        const record = await store.get('Price', id.toString());
        if (record){
            return Price.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Price(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

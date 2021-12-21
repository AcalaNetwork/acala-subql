// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class Dex implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolCount?: number;

    public totalVolumeUSD?: string;

    public totalTVLUSD?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Dex entity without an ID");
        await store.set('Dex', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Dex entity without an ID");
        await store.remove('Dex', id.toString());
    }

    static async get(id:string): Promise<Dex | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Dex entity without an ID");
        const record = await store.get('Dex', id.toString());
        if (record){
            return Dex.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<Dex, FunctionPropertyNames<Dex>>> & Entity): Dex {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Dex(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

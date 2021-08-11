// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class TotalBalance implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public balance?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TotalBalance entity without an ID");
        await store.set('TotalBalance', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TotalBalance entity without an ID");
        await store.remove('TotalBalance', id.toString());
    }

    static async get(id:string): Promise<TotalBalance | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TotalBalance entity without an ID");
        const record = await store.get('TotalBalance', id.toString());
        if (record){
            return TotalBalance.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new TotalBalance(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

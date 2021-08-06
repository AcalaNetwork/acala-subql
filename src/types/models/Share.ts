// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Share implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public accountId?: string;

    public amount?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Share entity without an ID");
        await store.set('Share', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Share entity without an ID");
        await store.remove('Share', id.toString());
    }

    static async get(id:string): Promise<Share | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Share entity without an ID");
        const record = await store.get('Share', id.toString());
        if (record){
            return Share.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Share(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

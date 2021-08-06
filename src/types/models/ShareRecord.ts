// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class ShareRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public accountId?: string;

    public amount?: string;

    public blockNumber?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ShareRecord entity without an ID");
        await store.set('ShareRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ShareRecord entity without an ID");
        await store.remove('ShareRecord', id.toString());
    }

    static async get(id:string): Promise<ShareRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ShareRecord entity without an ID");
        const record = await store.get('ShareRecord', id.toString());
        if (record){
            return ShareRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new ShareRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

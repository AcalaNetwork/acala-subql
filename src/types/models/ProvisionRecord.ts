// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class ProvisionRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public token0Id?: string;

    public token1Id?: string;

    public lpTokenId?: string;

    public token0Amount?: string;

    public token1Amount?: string;

    public blockNumber?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ProvisionRecord entity without an ID");
        await store.set('ProvisionRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ProvisionRecord entity without an ID");
        await store.remove('ProvisionRecord', id.toString());
    }

    static async get(id:string): Promise<ProvisionRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ProvisionRecord entity without an ID");
        const record = await store.get('ProvisionRecord', id.toString());
        if (record){
            return ProvisionRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new ProvisionRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

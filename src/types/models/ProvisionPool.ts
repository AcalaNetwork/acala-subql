// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class ProvisionPool implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolTokenId?: string;

    public token0Id?: string;

    public token1Id?: string;

    public token0Amount?: string;

    public token1Amount?: string;

    public initializeShare?: string;

    public startAtBlockNumber?: bigint;

    public startAtBlockId?: string;

    public endAtBlockNumber?: bigint;

    public endAtBlockId?: string;

    public txCount?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ProvisionPool entity without an ID");
        await store.set('ProvisionPool', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ProvisionPool entity without an ID");
        await store.remove('ProvisionPool', id.toString());
    }

    static async get(id:string): Promise<ProvisionPool | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ProvisionPool entity without an ID");
        const record = await store.get('ProvisionPool', id.toString());
        if (record){
            return ProvisionPool.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new ProvisionPool(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

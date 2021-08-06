// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Provision implements Entity {

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


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Provision entity without an ID");
        await store.set('Provision', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Provision entity without an ID");
        await store.remove('Provision', id.toString());
    }

    static async get(id:string): Promise<Provision | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Provision entity without an ID");
        const record = await store.get('Provision', id.toString());
        if (record){
            return Provision.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Provision(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

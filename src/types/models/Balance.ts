// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Balance implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public tokenId?: string;

    public total?: string;

    public balance?: string;

    public incentive?: string;

    public collateral?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Balance entity without an ID");
        await store.set('Balance', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Balance entity without an ID");
        await store.remove('Balance', id.toString());
    }

    static async get(id:string): Promise<Balance | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Balance entity without an ID");
        const record = await store.get('Balance', id.toString());
        if (record){
            return Balance.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Balance(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

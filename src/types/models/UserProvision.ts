// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class UserProvision implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolId: string;

    public token0Id: string;

    public token1Id: string;

    public token0Amount: string;

    public token1Amount: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save UserProvision entity without an ID");
        await store.set('UserProvision', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove UserProvision entity without an ID");
        await store.remove('UserProvision', id.toString());
    }

    static async get(id:string): Promise<UserProvision | undefined>{
        assert((id !== null && id !== undefined), "Cannot get UserProvision entity without an ID");
        const record = await store.get('UserProvision', id.toString());
        if (record){
            return UserProvision.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new UserProvision(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Summary implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public crossedKSMAmount?: string;

    public treasury?: string;

    public accounts?: number;

    public transitions?: number;

    public transfers?: number;

    public crossChainMessage?: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Summary entity without an ID");
        await store.set('Summary', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Summary entity without an ID");
        await store.remove('Summary', id.toString());
    }

    static async get(id:string): Promise<Summary | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Summary entity without an ID");
        const record = await store.get('Summary', id.toString());
        if (record){
            return Summary.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Summary(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

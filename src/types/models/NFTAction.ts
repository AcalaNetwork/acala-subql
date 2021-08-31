// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'


export class NFTAction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public type?: string;

    public subType?: string;

    public data?: KVData[];

    public extrinsicId?: string;

    public timestamp?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NFTAction entity without an ID");
        await store.set('NFTAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NFTAction entity without an ID");
        await store.remove('NFTAction', id.toString());
    }

    static async get(id:string): Promise<NFTAction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NFTAction entity without an ID");
        const record = await store.get('NFTAction', id.toString());
        if (record){
            return NFTAction.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NFTAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

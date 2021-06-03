// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'


export class Extrinsic implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public method?: string;

    public section?: string;

    public args?: KVData[];

    public signerId?: string;

    public nonce?: bigint;

    public timestamp?: Date;

    public signature?: string;

    public tip?: string;

    public isSigned?: boolean;

    public isSuccess?: boolean;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Extrinsic entity without an ID");
        await store.set('Extrinsic', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Extrinsic entity without an ID");
        await store.remove('Extrinsic', id.toString());
    }

    static async get(id:string): Promise<Extrinsic | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Extrinsic entity without an ID");
        const record = await store.get('Extrinsic', id.toString());
        if (record){
            return Extrinsic.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Extrinsic(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

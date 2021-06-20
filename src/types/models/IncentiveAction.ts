// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'


export class IncentiveAction implements Entity {

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
        assert(id !== null, "Cannot save IncentiveAction entity without an ID");
        await store.set('IncentiveAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove IncentiveAction entity without an ID");
        await store.remove('IncentiveAction', id.toString());
    }

    static async get(id:string): Promise<IncentiveAction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get IncentiveAction entity without an ID");
        const record = await store.get('IncentiveAction', id.toString());
        if (record){
            return IncentiveAction.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new IncentiveAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

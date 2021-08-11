// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    KVData,
} from '../interfaces'


export class HomaAction implements Entity {

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
        assert(id !== null, "Cannot save HomaAction entity without an ID");
        await store.set('HomaAction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove HomaAction entity without an ID");
        await store.remove('HomaAction', id.toString());
    }

    static async get(id:string): Promise<HomaAction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get HomaAction entity without an ID");
        const record = await store.get('HomaAction', id.toString());
        if (record){
            return HomaAction.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new HomaAction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

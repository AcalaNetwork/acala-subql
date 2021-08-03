// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class BalanceChangedRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public tokenId?: string;

    public changed?: string;

    public total?: string;

    public timestamp?: Date;

    public blockNumber?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BalanceChangedRecord entity without an ID");
        await store.set('BalanceChangedRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BalanceChangedRecord entity without an ID");
        await store.remove('BalanceChangedRecord', id.toString());
    }

    static async get(id:string): Promise<BalanceChangedRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get BalanceChangedRecord entity without an ID");
        const record = await store.get('BalanceChangedRecord', id.toString());
        if (record){
            return BalanceChangedRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new BalanceChangedRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

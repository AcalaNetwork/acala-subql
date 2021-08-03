// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class TotalBalanceChangedRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public changed?: string;

    public total?: string;

    public timestamp?: Date;

    public blockNumber?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TotalBalanceChangedRecord entity without an ID");
        await store.set('TotalBalanceChangedRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TotalBalanceChangedRecord entity without an ID");
        await store.remove('TotalBalanceChangedRecord', id.toString());
    }

    static async get(id:string): Promise<TotalBalanceChangedRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TotalBalanceChangedRecord entity without an ID");
        const record = await store.get('TotalBalanceChangedRecord', id.toString());
        if (record){
            return TotalBalanceChangedRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new TotalBalanceChangedRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

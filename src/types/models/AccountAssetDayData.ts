// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class AccountAssetDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public totalInUSD?: string;

    public timestamp?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AccountAssetDayData entity without an ID");
        await store.set('AccountAssetDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AccountAssetDayData entity without an ID");
        await store.remove('AccountAssetDayData', id.toString());
    }

    static async get(id:string): Promise<AccountAssetDayData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AccountAssetDayData entity without an ID");
        const record = await store.get('AccountAssetDayData', id.toString());
        if (record){
            return AccountAssetDayData.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new AccountAssetDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

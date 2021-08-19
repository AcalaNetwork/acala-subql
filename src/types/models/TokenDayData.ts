// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class TokenDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public date?: Date;

    public tokenId?: string;

    public dailyVolumeToken?: string;

    public dailyVolumeUSD?: string;

    public dailyTxCount?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TokenDayData entity without an ID");
        await store.set('TokenDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TokenDayData entity without an ID");
        await store.remove('TokenDayData', id.toString());
    }

    static async get(id:string): Promise<TokenDayData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TokenDayData entity without an ID");
        const record = await store.get('TokenDayData', id.toString());
        if (record){
            return TokenDayData.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new TokenDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

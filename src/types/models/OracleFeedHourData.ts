// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class OracleFeedHourData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public accountId?: string;

    public provider?: string;

    public averagePrice?: string;

    public timestamp?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save OracleFeedHourData entity without an ID");
        await store.set('OracleFeedHourData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove OracleFeedHourData entity without an ID");
        await store.remove('OracleFeedHourData', id.toString());
    }

    static async get(id:string): Promise<OracleFeedHourData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get OracleFeedHourData entity without an ID");
        const record = await store.get('OracleFeedHourData', id.toString());
        if (record){
            return OracleFeedHourData.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new OracleFeedHourData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

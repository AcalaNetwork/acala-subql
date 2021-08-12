// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class SummaryDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public date?: Date;

    public crossedKSMAmount?: string;

    public treasury?: string;

    public accounts?: number;

    public transitions?: number;

    public transfers?: number;

    public crossChainMessage?: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SummaryDayData entity without an ID");
        await store.set('SummaryDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SummaryDayData entity without an ID");
        await store.remove('SummaryDayData', id.toString());
    }

    static async get(id:string): Promise<SummaryDayData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SummaryDayData entity without an ID");
        const record = await store.get('SummaryDayData', id.toString());
        if (record){
            return SummaryDayData.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new SummaryDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

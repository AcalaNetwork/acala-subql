// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class DexDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolCount?: number;

    public date?: Date;

    public dailyVolumeUSD?: string;

    public totalVolumeUSD?: string;

    public totalTVLUSD?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save DexDayData entity without an ID");
        await store.set('DexDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove DexDayData entity without an ID");
        await store.remove('DexDayData', id.toString());
    }

    static async get(id:string): Promise<DexDayData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get DexDayData entity without an ID");
        const record = await store.get('DexDayData', id.toString());
        if (record){
            return DexDayData.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<DexDayData, FunctionPropertyNames<DexDayData>>> & Entity): DexDayData {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new DexDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

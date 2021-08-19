// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class PoolDayData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolId?: string;

    public token0Id: string;

    public token1Id: string;

    public date?: Date;

    public token0Amount?: string;

    public token1Amount?: string;

    public exchange0?: string;

    public exchange1?: string;

    public volumeToken0?: string;

    public volumeToken1?: string;

    public volumeUSD?: string;

    public txCount?: bigint;

    public tvlUSD?: string;

    public token0Open?: string;

    public token0High?: string;

    public token0Low?: string;

    public token0Close?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save PoolDayData entity without an ID");
        await store.set('PoolDayData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove PoolDayData entity without an ID");
        await store.remove('PoolDayData', id.toString());
    }

    static async get(id:string): Promise<PoolDayData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get PoolDayData entity without an ID");
        const record = await store.get('PoolDayData', id.toString());
        if (record){
            return PoolDayData.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new PoolDayData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

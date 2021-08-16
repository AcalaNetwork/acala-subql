// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class PoolHourData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public poolId: string;

    public startAt: number;

    public token0Id: string;

    public token1Id: string;

    public token0Amount: string;

    public token1Amount: string;

    public exchange0: string;

    public exchange1: string;

    public volumnToken0: string;

    public volumnToken1: string;

    public volumnUSD: string;

    public txCount: number;

    public tvlUSD: string;

    public token0Open: string;

    public token0High: string;

    public token0Low: string;

    public token0Close: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save PoolHourData entity without an ID");
        await store.set('PoolHourData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove PoolHourData entity without an ID");
        await store.remove('PoolHourData', id.toString());
    }

    static async get(id:string): Promise<PoolHourData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get PoolHourData entity without an ID");
        const record = await store.get('PoolHourData', id.toString());
        if (record){
            return PoolHourData.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new PoolHourData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

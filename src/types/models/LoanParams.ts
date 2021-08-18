// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class LoanParams implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public collateralId?: string;

    public debitExchangeRate?: string;

    public startAtBlockNumber?: bigint;

    public startAtBlockId?: string;

    public maximumTotalDebitValue?: string;

    public interestRatePerSec?: string;

    public liquidationRatio?: string;

    public liquidationPenalty?: string;

    public requiredCollateralRatio?: string;

    public globalInterestRatePerSec?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanParams entity without an ID");
        await store.set('LoanParams', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanParams entity without an ID");
        await store.remove('LoanParams', id.toString());
    }

    static async get(id:string): Promise<LoanParams | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LoanParams entity without an ID");
        const record = await store.get('LoanParams', id.toString());
        if (record){
            return LoanParams.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new LoanParams(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

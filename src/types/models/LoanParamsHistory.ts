// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class LoanParamsHistory implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public collateralId: string;

    public startAtBlockNumber: bigint;

    public startAtBlockId?: string;

    public endAtBlockNumber?: bigint;

    public endAtBlockId?: string;

    public maximumTotalDebitValue: string;

    public interestRatePerSec: string;

    public liquidationRatio: string;

    public liquidationPenalty: string;

    public requiredCollateralRatio: string;

    public globalInterestRatePerSec: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanParamsHistory entity without an ID");
        await store.set('LoanParamsHistory', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanParamsHistory entity without an ID");
        await store.remove('LoanParamsHistory', id.toString());
    }

    static async get(id:string): Promise<LoanParamsHistory | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LoanParamsHistory entity without an ID");
        const record = await store.get('LoanParamsHistory', id.toString());
        if (record){
            return LoanParamsHistory.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new LoanParamsHistory(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

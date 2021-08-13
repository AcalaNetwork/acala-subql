// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class TotalLoanPosition implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public collateralId?: string;

    public debitAmount?: string;

    public collateralAmount?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TotalLoanPosition entity without an ID");
        await store.set('TotalLoanPosition', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TotalLoanPosition entity without an ID");
        await store.remove('TotalLoanPosition', id.toString());
    }

    static async get(id:string): Promise<TotalLoanPosition | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TotalLoanPosition entity without an ID");
        const record = await store.get('TotalLoanPosition', id.toString());
        if (record){
            return TotalLoanPosition.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new TotalLoanPosition(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

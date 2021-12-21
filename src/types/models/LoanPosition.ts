// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class LoanPosition implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public ownerId?: string;

    public collateralId?: string;

    public debitAmount?: string;

    public collateralAmount?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LoanPosition entity without an ID");
        await store.set('LoanPosition', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LoanPosition entity without an ID");
        await store.remove('LoanPosition', id.toString());
    }

    static async get(id:string): Promise<LoanPosition | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LoanPosition entity without an ID");
        const record = await store.get('LoanPosition', id.toString());
        if (record){
            return LoanPosition.create(record);
        }else{
            return;
        }
    }


    static async getByOwnerId(ownerId: string): Promise<LoanPosition[] | undefined>{
      
      const records = await store.getByField('LoanPosition', 'ownerId', ownerId);
      return records.map(record => LoanPosition.create(record));
      
    }

    static async getByCollateralId(collateralId: string): Promise<LoanPosition[] | undefined>{
      
      const records = await store.getByField('LoanPosition', 'collateralId', collateralId);
      return records.map(record => LoanPosition.create(record));
      
    }


    static create(record: Partial<Omit<LoanPosition, FunctionPropertyNames<LoanPosition>>> & Entity): LoanPosition {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new LoanPosition(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

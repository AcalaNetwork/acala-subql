// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class SystemConsts implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public liquidTokenId?: string;

    public stakignTokenId?: string;

    public nativeTokenId?: string;

    public stableTokenId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SystemConsts entity without an ID");
        await store.set('SystemConsts', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SystemConsts entity without an ID");
        await store.remove('SystemConsts', id.toString());
    }

    static async get(id:string): Promise<SystemConsts | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SystemConsts entity without an ID");
        const record = await store.get('SystemConsts', id.toString());
        if (record){
            return SystemConsts.create(record);
        }else{
            return;
        }
    }


    static async getByLiquidTokenId(liquidTokenId: string): Promise<SystemConsts[] | undefined>{
      
      const records = await store.getByField('SystemConsts', 'liquidTokenId', liquidTokenId);
      return records.map(record => SystemConsts.create(record));
      
    }

    static async getByStakignTokenId(stakignTokenId: string): Promise<SystemConsts[] | undefined>{
      
      const records = await store.getByField('SystemConsts', 'stakignTokenId', stakignTokenId);
      return records.map(record => SystemConsts.create(record));
      
    }

    static async getByNativeTokenId(nativeTokenId: string): Promise<SystemConsts[] | undefined>{
      
      const records = await store.getByField('SystemConsts', 'nativeTokenId', nativeTokenId);
      return records.map(record => SystemConsts.create(record));
      
    }

    static async getByStableTokenId(stableTokenId: string): Promise<SystemConsts[] | undefined>{
      
      const records = await store.getByField('SystemConsts', 'stableTokenId', stableTokenId);
      return records.map(record => SystemConsts.create(record));
      
    }


    static create(record: Partial<Omit<SystemConsts, FunctionPropertyNames<SystemConsts>>> & Entity): SystemConsts {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new SystemConsts(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

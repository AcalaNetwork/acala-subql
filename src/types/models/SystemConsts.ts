// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
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



    static create(record){
        let entity = new SystemConsts(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

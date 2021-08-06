// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class ProvisionOpenState implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public token0?: string;

    public token1?: string;

    public initIssuance?: string;

    public blockNumber?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ProvisionOpenState entity without an ID");
        await store.set('ProvisionOpenState', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ProvisionOpenState entity without an ID");
        await store.remove('ProvisionOpenState', id.toString());
    }

    static async get(id:string): Promise<ProvisionOpenState | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ProvisionOpenState entity without an ID");
        const record = await store.get('ProvisionOpenState', id.toString());
        if (record){
            return ProvisionOpenState.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new ProvisionOpenState(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

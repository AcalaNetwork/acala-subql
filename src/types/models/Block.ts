// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class Block implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public number?: bigint;

    public timestamp?: Date;

    public parentHash?: string;

    public specVersion?: string;

    public stateRoot?: string;

    public extrinsicRoot?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Block entity without an ID");
        await store.set('Block', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Block entity without an ID");
        await store.remove('Block', id.toString());
    }

    static async get(id:string): Promise<Block | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Block entity without an ID");
        const record = await store.get('Block', id.toString());
        if (record){
            return Block.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<Block, FunctionPropertyNames<Block>>> & Entity): Block {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Block(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

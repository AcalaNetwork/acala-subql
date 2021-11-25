import { AnyTuple, ArgsDef } from '@polkadot/types/types';

// export const getKVData = (data: AnyTuple, keys?: AnyTuple) => (keys || (data as any).typeDef).map((item, index) => ({
//     key: item.type.toString(),
//     value: data[index].toString()
// }))

export const getKVData = (data: AnyTuple, keys?: ArgsDef) => {
    if (!data) return [];


    if (!keys) {
        return data.map((item, index) => {
            return {
                key: '' + index,
                type: (data as any).typeDef?.[index]?.type?.toString(),
                value: item?.toString()
            }
        })
    }

    return Object.keys(keys).map((_key, index) => {
        return {
            key: _key,
            type: (data[index] as any).type,
            value: data[index]?.toString()
        }
    })
}

api.query.system.account.keyPrefix()
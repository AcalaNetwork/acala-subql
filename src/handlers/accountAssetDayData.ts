import { FixedPointNumber } from "@acala-network/sdk-core";
import { AccountAssetDayData } from "../types/models/AccountAssetDayData";
import { Asset } from "../types/models/Asset";

const DAY = 24 * 60 * 60 * 1000;

function add (a: string, b: string) {
    let _a = new FixedPointNumber(a)
    let _b = new FixedPointNumber(b)

    if (!_a.isFinaite()) _a = new FixedPointNumber(0)
    if (!_b.isFinaite()) _b = new FixedPointNumber(0)

    return _a.plus(_b).toString()
}

export async function updateAccountAssetDayData (asset: Asset, timestamp: number) {
    const dayTimestamp = timestamp % DAY * DAY
    let data = await AccountAssetDayData.get(`${asset.accountId}-${dayTimestamp}`)

    if (!data) {
        data = new AccountAssetDayData(`${asset.accountId}-${dayTimestamp}`)
        data.accountId = asset.accountId
    }

    data.timestamp = new Date(dayTimestamp)
    data.totalInUSD = add(data.totalInUSD, asset.totalInUSD);

    await data.save()

    return data
}
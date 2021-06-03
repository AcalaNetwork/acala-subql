import { AccountAssetDayData } from "../types/models/AccountAssetDayData";
import { Asset } from "../types/models/Asset";

const DAY = 24 * 60 * 60 * 1000;

export async function updateAccountAssetDayData (asset: Asset, timestamp: number) {
    const dayTimestamp = timestamp % DAY * DAY
    let data = await AccountAssetDayData.get(`${asset.accountId}-${dayTimestamp}`)

    if (data) {
        data = new AccountAssetDayData(`${asset.accountId}-${dayTimestamp}`)
        data.accountId = asset.accountId
    }

    data.timestamp = new Date(dayTimestamp)
    data.totalInUSD = String(Number(data.totalInUSD || 0) + Number(asset.totalInUSD))

    await data.save()

    return data
}
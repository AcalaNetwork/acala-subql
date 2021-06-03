import { FixedPointNumber } from "@acala-network/sdk-core";
import { ensureAccount, getAccount } from "./account";
import { getNativeToken, getToken } from "./tokens";
import { OrmlAccountData } from '@open-web3/orml-types/interfaces';
import { getPrice } from "./price";
import { Asset } from "../types/models/Asset";
import { updateAccountAssetDayData } from "./accountAssetDayData";
import { SubstrateEvent } from "@subql/types";
import { getTokenName } from "./utils/token";
import { DispatchedEventData } from "./types";

export async function updateAccountAsset (address: string, symbol: string, timestamp: number) {
    const account = await ensureAccount(address)
    const token = await getToken(symbol)
    const price = await getPrice(symbol)
    const nativeToken = await getNativeToken()
    const ZERO = new FixedPointNumber(0, token.decimal)

    let free = ZERO.clone()
    let reserved = ZERO.clone()
    let frozen = ZERO.clone()
    let total = ZERO.clone()

    if (symbol === nativeToken.symbol) {
        const temp = await api.query.system.account(address)

        free = FixedPointNumber.fromInner(temp.data.free.toString(), token.decimal)
        reserved = FixedPointNumber.fromInner(temp.data.reserved.toString(), token.decimal)
        frozen = FixedPointNumber.fromInner(temp.data.feeFrozen.toString(), token.decimal)
    } else {
        const temp = await api.query.tokens.accounts<OrmlAccountData>(address, { Token: symbol })

        free = FixedPointNumber.fromInner(temp.free.toString(), token.decimal)
        reserved = FixedPointNumber.fromInner(temp.reserved.toString(), token.decimal)
        frozen = FixedPointNumber.fromInner(temp.frozen.toString(), token.decimal)
    }

    total = free.plus(reserved).plus(frozen)

    const totalInUSD = total.times(new FixedPointNumber(price.price, token.decimal))

    let asset = await Asset.get(`${address}-${symbol}`)

    if (!asset) {
        asset = new Asset(`${address}-${symbol}`)

        asset.accountId = account.id
        asset.tokenId = token.id
    }

    asset.free = free.toChainData()
    asset.reserved = reserved.toChainData()
    asset.frozen = frozen.toChainData()
    asset.total = total.toChainData()
    asset.totalInUSD = totalInUSD.toString()

    await updateAccountAssetDayData(asset, timestamp)
    await asset.save()
}

export async function handleBalanceUpdateEvent ({ event, rawEvent }: DispatchedEventData) {
    const args = rawEvent.event.data;
    const token = getTokenName(args[0])
    const target = args[1].toString()
    const timestamp = rawEvent.block.timestamp.getTime()

    await updateAccountAsset(target, token, timestamp)
}
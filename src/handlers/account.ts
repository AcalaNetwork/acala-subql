import { Account } from "../types";

export async function ensureAccount (account: string) {
    const record = await Account.get(account)

    if (record) return record

    const temp = new Account(account)

    await temp.save()

    return temp
}

export async function getAccount (account: string) {
    const record = await Account.get(account)

    return record
}
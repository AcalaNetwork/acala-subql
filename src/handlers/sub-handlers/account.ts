import { Account } from "../../types/models/Account"

interface AccountData {
  id: string
  address: string
}

export class AccountHandler {

  static async ensureAccount (id: string) {
    const account = await Account.get(id)

    if (!account) {
      return new Account(id).save()
    }
  }

  static async getAccountById (id: string) {
    await this.ensureAccount(id)

    const account = await Account.get(id)

    return account
  }

  static async updateAccount (id: string, data: Record<string, any>) {
    const account = await this.getAccountById(id)

    Object.keys(data).forEach((key, value) => {
      account[key] = value
    })

    await account.save()
  }
}
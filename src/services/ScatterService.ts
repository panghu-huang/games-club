// @ts-nocheck
import { EventEmitter, Listener } from 'events'
import { networkConfig } from 'src/config'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import EOS$JS from 'eosjs'

export type EventName = 'login' | 'logout'

ScatterJS.plugins(new ScatterEOS())

const emitter = new EventEmitter()

export class ScatterService {

  public static async login() {
    try {
      const scatter = ScatterJS.scatter
      const connected = await scatter.connect('GameScore')
      if (!connected) {
        throw new Error()
      }
      const requiredFields = {
        accounts: [networkConfig]
      }
      this.identity = await scatter.getIdentity(requiredFields)
      this.scatter = scatter
      this.eos = scatter.eos(networkConfig, EOS$JS, {
        expireInSeconds: 20,
      })

      // remove reference
      window.ScatterJS = null
      window.ScatterEOS = null
      window.scatter = null

      emitter.emit('login', this.identity)

      return this.identity
    } catch (error) {
      throw new Error('请安装并打开 Scatter')
    }
  }

  public static async logout() {
    if (this.scatter) {
      await this.scatter.forgetIdentity()
      emitter.emit('logout')
    }
    this.scatter = null
    this.identity = null
  }

  public static async getTableRows(
    scope: string, 
    code: string, 
    table: string,
    lowerBound?: string,
    keyType?: string
  ) {
    if (!this.eos) {
      this.eos = ScatterJS.scatter.eos(networkConfig, EOS$JS, {
        expireInSeconds: 20,
      })
    }
    return await this.eos.getTableRows({
      scope,
      code,
      table,
      lower_bound: lowerBound,
      key_type: keyType,
      json: true,
    })
  }

  public static async getCurrencyBalance(
    code: string,
    account,
    symbol: string
  ) {
    if (!this.eos) {
      this.eos = ScatterJS.scatter.eos(networkConfig, EOS$JS, {
        expireInSeconds: 20,
      })
    }
    return this.eos.getCurrencyBalance({ 
      code, account, symbol, 
    })
  }

  public static async getEOSBalance(account: stirng) {
    return this.getCurrencyBalance(
      'eosio.token', account, 'EOS'
    )
  }

  public static getAccountName(blockchain: string = 'eos') {
    if (!this.identity) {
      return this.throwUnloginError()
    }
    const account: IIdentity = this.identity.accounts
      .find((identity: IIdentity) => identity.blockchain === blockchain);
    if (account) {
      return account.name;
    }
  }

  public static transfer(to: string, quantity: string, memo?: string) {
    const from = this.getAccountName()
    return this.transaction('eosio.token', 'transfer', {
      from,
      to,
      quantity,
      memo,
    })
  }

  public static async transaction(account: string, name: string, data: object) {
    const eos = this.eos
    const accountName = this.getAccountName()
    if (!eos || !accountName) {
      this.throwUnloginError()
    }
    await eos.transaction({
      actions: [
        {
          account,
          name,
          authorization: [{
            actor: accountName,
            permission: 'active',
          }],
          data,
        }
      ]
    })
  }

  public static on(evt: EventName, listener: Listener) {
    emitter.on(evt, listener)
  }

  public static once(evt: EventName, listener: Listener) {
    emitter.once(evt, listener)
  }

  public static off(evt: EventName, listener: Listener) {
    emitter.off(evt, listener)
  }

  private static scatter: any = null
  private static identity: any = null
  private static eos: any = null

  private static throwUnloginError() {
    throw new Error('未安装 Scatter 或者登录失败')
  }
}
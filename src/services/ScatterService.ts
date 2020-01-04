import { EventEmitter } from 'events'
import { formatError } from 'src/utils'
import { networkConfig } from 'src/config'
// @ts-ignore
import EOS$JS from 'eosjs'

export type EventName = 'login' | 'logout'

type Listener = (...args: any[]) => void

declare global {
  interface Window {
    scatter: any
  }
}

const emitter = new EventEmitter()

export class ScatterService {

  public static async login() {
    try {
      if (!this.identity) {
        const scatter = await this.getScatter()
        const connected = scatter.connect
          ? await scatter.connect('GameScore')
          : true
        if (!connected) {
          throw new Error('请安装并打开 Scatter')
        }
        const requiredFields = {
          accounts: [networkConfig]
        }
        this.identity = scatter.login
          ? await scatter.login(requiredFields) 
          : await scatter.getIdentity(requiredFields)
  
        emitter.emit('login', this.identity)
      }

      return this.identity
    } catch (error) {
      const message = formatError(error)
      throw new Error(message)
    }
  }

  public static async logout() {
    if (this.scatter) {
      await this.scatter.forgetIdentity()
      emitter.emit('logout')
    }

    this.identity = null
  }

  public static async getTableRows(
    scope: string, 
    code: string, 
    table: string,
    lowerBound?: string,
    keyType?: string
  ) {
    const eos = await this.getEOS()
    return await eos.getTableRows({
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
    account: string,
    symbol: string
  ) {
    try {
      const eos = await this.getEOS()
      return await eos.getCurrencyBalance({ 
        code, account, symbol, 
      })
    } catch (error) {
      throw new Error(formatError(error))
    }
  }

  public static async getEOSBalance(account: string) {
    return this.getCurrencyBalance(
      'eosio.token', account, 'EOS'
    )
  }

  public static getAccountName(blockchain: string = 'eos') {
    if (!this.identity) {
      return this.throwUnloginError()
    }
    const account = this.identity.accounts
      .find((identity: any) => identity.blockchain === blockchain)

    if (account) {
      return account.name
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
    try {
      const eos = await this.getEOS()
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
    } catch (error) {
      throw new Error(formatError(error))
    }
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

  private static async getScatter(): Promise<any> {
    if (!this.scatter) {
      if (window.scatter) {
        this.scatter = window.scatter
      } else {
        const ScatterJS = (await import(/* webpackChunkName: "scatterjs" */'scatterjs-core' as any)).default
        const ScatterEOS = (await import(/* webpackChunkName: "scatterjs-eos" */'scatterjs-plugin-eosjs' as any)).default
        
        ScatterJS.plugins(new ScatterEOS())
  
        this.scatter = ScatterJS.scatter
      }
    }
    
    return this.scatter
  }

  private static async getEOS(): Promise<any> {
    if (!this.eos) {
      const scatter = await this.getScatter()
      this.eos = scatter.eos(networkConfig, EOS$JS, {
        expireInSeconds: 20,
      })
    }

    return this.eos
  }
}
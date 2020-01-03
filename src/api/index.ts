import * as types from 'src/types'
import { ScatterService } from 'src/services'
import { networkConfig, contract, GameStatus } from 'src/config'
import axios from 'axios'

const isServer = typeof window === 'undefined'

function getUrl(path: string) {
  const baseUrl = `${networkConfig.protocol}://${networkConfig.host}/v1/chain`
  return baseUrl + path
}

async function getTableRows<T = any>(
  scope: string, 
  code: string, 
  table: string,
  lowerBound?: string,
  keyType?: string
): Promise<{ rows: T[], has_more: boolean }> {
  const url = getUrl('/get_table_rows')
  if (!isServer) {
    return await ScatterService.getTableRows(
      scope,
      code,
      table,
      lowerBound,
      keyType
    )
  }
  const response = await axios.get(url, {
    headers: {
      'Content-type': 'application/json'
    },
    data: {
      scope,
      code,
      table,
      lower_bound: lowerBound,
      key_type: keyType,
      json: true,
    },
  })

  return response.data
}

export async function getCurrentGame() {
  const { rows } = await getTableRows<types.Game>(
    contract,
    contract,
    'game',
  )

  const unfinished = rows.find(game => game.status !== GameStatus.Finished)

  return unfinished || rows[rows.length - 1]
}

export async function getGameRecords(game: number, lastRecordId?: number) {
  const { rows } = await getTableRows<types.Record>(
    game + '',
    contract,
    'record',
    lastRecordId ? String(lastRecordId + 1) : undefined,
  )

  return rows
}

export async function getBettedList(account: string) {
  const { rows } = await getTableRows<types.UserBetted>(
    contract,
    contract,
    'user',
    account,
    'name'
  )

  return rows
}

export async function claimReward(gameId: number, account: string) {
  return await ScatterService.transaction(
    contract,
    'claim',
    {
      gameid: gameId,
      account,
    }
  )
}

export async function startPlay(gameId: number) {
  return await ScatterService.transaction(
    contract,
    'play',
    { gameid: gameId }
  )
}

export async function lottery(gameId: number, winner: string) {
  return await ScatterService.transaction(
    contract,
    'lottery',
    { 
      gameid: gameId,
      winner,
    }
  )
}
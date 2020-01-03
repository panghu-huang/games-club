import { GameStatus } from 'src/config'

export interface Game {
  id: number
  admin: string
  redteam: string
  blueteam: string
  winner: string
  ramount: string
  bamount: string
  rusercount: number
  busercount: number
  status: GameStatus
}

export interface Record {
  id: number
  user: string
  winner: string
  quantity: string
  timestamp: number
  reward: string
  claimed: number
}

export interface UserBetted {
  name: string
  count: number
  amount: string
  reward: string
  totalreward: string
  claim_time: number
}
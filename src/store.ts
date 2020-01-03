import { create } from '@wokeyi/store'
import { Game } from 'src/types'

export interface Store {
  currentGame: Game
  account: string | null
  balance: number
  lastBetTime: number
}

type Action = {
  type: 'SET_CURRENT_GAME'
  currentGame: Game
} | {
  type: 'SET_ACCOUNT'
  account: string | null
} | {
  type: 'SET_BALANCE',
  balance: number
} | {
  type: 'SET_LAST_BET_TIME',
  lastBetTime: number
}

const reducer = (previousState: Store, action: Action): Store => {
  switch(action.type) {
    case 'SET_CURRENT_GAME':
      return {
        ...previousState,
        currentGame: action.currentGame,
      }
    case 'SET_ACCOUNT':
      return {
        ...previousState,
        balance: 0,
        account: action.account,
      }
    case 'SET_BALANCE':
      return {
        ...previousState,
        balance: action.balance,
      }
    case 'SET_LAST_BET_TIME':
      return {
        ...previousState,
        lastBetTime: action.lastBetTime,
      }
    default:
      return previousState
  }
}

const { useDispatch, useStore, StoreProvider } = create(reducer)

export {
  useDispatch,
  useStore,
  StoreProvider,
}

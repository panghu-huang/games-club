import * as React from 'react'
import * as types from 'src/types'
import { AppProps } from 'server-renderer'
import { PageHeader } from 'src/layout'
import { 
  AppContainer,
  GameProgress, 
  GameTeams, 
  RecordList, 
  BetModal,
  BettedList,
  Manager,
  ErrorMessage
} from 'src/components'
import { Store, StoreProvider } from 'src/store'
import { getCurrentGame, getGameRecords } from 'src/api'
import './global.scss'

interface GameScoreAppProps extends AppProps {
  currentGame: types.Game
  records: types.Record[]
  hasMoreRecords: boolean
  error?: any
}

const GameScoreApp: React.FC<GameScoreAppProps> = props => {
  if (props.error) {
    return (
      <ErrorMessage error={props.error}/>
    )
  }

  const initialState: Store = {
    currentGame: props.currentGame,
    balance: 0,
    account: null,
    lastBetTime: 0,
  }

  return (
    <StoreProvider initialState={initialState}>
      <AppContainer>
        <PageHeader/>
        <GameProgress/>
        <GameTeams/>
        <BettedList/>
        <RecordList 
          hasMore={props.hasMoreRecords}
          records={props.records}
        />
        <BetModal/>
        <Manager/>
      </AppContainer>
    </StoreProvider>
  )
}

GameScoreApp.getInitialProps = async (): Promise<Partial<GameScoreAppProps>> => {
  try {
    console.log('fetch')
    const start = Date.now()
    const currentGame = await getCurrentGame()
    const records = await getGameRecords(currentGame?.id)
    console.log(((Date.now() - start) / 1000).toFixed(2))
    return {
      currentGame,
      records: records.rows,
      hasMoreRecords: records.more,
    }
  } catch (error) {
    return {
      error,
    }
  }
}

export default GameScoreApp

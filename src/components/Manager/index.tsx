import * as React from 'react'
import { Button } from 'antd'
import { useStore } from 'src/store'
import { useTrigger } from 'src/hooks'
import { GameStatus } from 'src/config'
import StartPlay from './StartPlay'
import Lottery from './Lottery'
import classes from './Manager.scss'

const BetModal: React.FC = () => {
  const { currentGame, account } = useStore()
  const trigger = useTrigger()

  if (
    !account ||
    account !== currentGame.admin || 
    GameStatus.Finished === currentGame.status
  ) {
    return null
  }

  const gameStatus = currentGame.status

  return (
    <>
      <Button
        size='large'
        type='primary'
        icon='setting'
        shape='circle'
        className={classes.trigger}
        onClick={trigger.open}
      />
      {gameStatus === GameStatus.Betting && (
        <StartPlay
          gameId={currentGame.id}
          visible={trigger.value}
          onClose={trigger.close}
        />
      )}
      {gameStatus === GameStatus.Running && (
        <Lottery
          visible={trigger.value}
          onClose={trigger.close}
        />
      )}
    </>
  )
}

export default BetModal
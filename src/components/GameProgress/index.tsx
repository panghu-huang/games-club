import * as React from 'react'
import { Steps } from 'antd'
import { useStore } from 'src/store'
import { GameStatus } from 'src/config'
import classes from './GameProgress.scss'

const GameProgress: React.FC = () => {
  const game = useStore().currentGame
  const status = game.status !== GameStatus.Finished
    ? game.status - 1
    : game.status
  
  return React.useMemo(
    () => {
      return (
        <Steps
          size='small'
          className={classes.container}
          current={status}>
          <Steps.Step title='投注开始'/>
          <Steps.Step title='比赛开始'/>
          <Steps.Step title='比赛结束'/>
        </Steps>
      )
    },
    [game.id, game.status]
  )
}

export default GameProgress

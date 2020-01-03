import * as React from 'react'
import { Modal, Button, message } from 'antd'
import { useDispatch } from 'src/store'
import { useTrigger } from 'src/hooks'
import { startPlay, getCurrentGame } from 'src/api'
import classes from './Manager.scss'

interface StartPlayProps {
  gameId: number
  visible: boolean
  onClose: () => void
}

const StartPlay: React.FC<StartPlayProps> = props => {
  const dispatch = useDispatch()
  const loadingTrigger = useTrigger()

  const start = React.useCallback(
    async () => {
      try {
        loadingTrigger.open()
        await startPlay(props.gameId)
        const game = await getCurrentGame()
        dispatch({
          type: 'SET_CURRENT_GAME',
          currentGame: game,
        })
        props.onClose()
        message.success('操作成功')
      } catch (error) {
        message.error(error.message)
        loadingTrigger.close()
      }
    },
    [props.gameId]
  )
  return (
    <Modal
      title='结束投注'
      footer={null}
      visible={props.visible}
      onCancel={props.onClose}>
      <div className={classes.startPlayWrapper}>
        <Button 
          type='primary'
          loading={loadingTrigger.value}
          onClick={start}>
          结束投注，开始游戏！
        </Button>
      </div>
    </Modal>
  )
}

export default StartPlay
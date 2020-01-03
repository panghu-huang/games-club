import * as React from 'react'
import { Radio, Form, Modal, message } from 'antd'
import { getCurrentGame, lottery } from 'src/api'
import { useTrigger } from 'src/hooks'
import { useStore, useDispatch } from 'src/store'

export interface LotteryProps {
  visible: boolean
  onClose: () => void
}

const Lottery: React.FC<LotteryProps> = props => {
  const dispatch = useDispatch()
  const trigger = useTrigger()
  const { currentGame } = useStore()
  const [team, setTeam] = React.useState(currentGame.redteam)

  const handleTeamChange = React.useCallback(
    (evt: any) => {
      const { value } = evt.target
      setTeam(value)
    },
    []
  )

  const handleSubmit = React.useCallback(
    async () => {
      try {
        trigger.open()
        await lottery(currentGame.id, team)
        const game = await getCurrentGame()
        dispatch({
          type: 'SET_CURRENT_GAME',
          currentGame: game,
        })
        props.onClose()
        message.success('操作成功')
      } catch (error) {
        message.error(error.message)
      } finally {
        trigger.close()
      }
    },
    [team]
  )

  return (
    <Modal
      title='开奖'
      okText='确定'
      cancelText='取消'
      visible={props.visible}
      onCancel={props.onClose}
      onOk={handleSubmit}
      okButtonProps={{
        loading: trigger.value,
      }}>
      <Form>
        <Form.Item label='赢家队伍'>
          <Radio.Group
            value={team}
            onChange={handleTeamChange}>
            <Radio.Button value={currentGame.redteam}>
              {currentGame.redteam}
            </Radio.Button>
            <Radio.Button value={currentGame.blueteam}>
              {currentGame.blueteam}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Lottery


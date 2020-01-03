import * as React from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { Radio, InputNumber, Form, Modal, message } from 'antd'
import { ScatterService } from 'src/services'
import { getCurrentGame } from 'src/api'
import { contract } from 'src/config'
import { useStore, useDispatch } from 'src/store'
import classes from './BetModal.scss'

export interface BetFormModalProps {
  visible: boolean
  onClose: () => void
}

const BetFormModal: React.FC<BetFormModalProps> = props => {
  const dispatch = useDispatch()
  const { currentGame, balance } = useStore()
  const [team, setTeam] = React.useState(currentGame.redteam)
  const [value, setValue] = React.useState<number | undefined>()
  const [betting, setBetting] = React.useState(false)

  const handleTeamChange = React.useCallback(
    (evt: any) => {
      const { value } = evt.target
      setTeam(value)
    },
    []
  )

  const handleValueChange = React.useCallback(
    (value: number | undefined) => {
      setValue(value)
    },
    []
  )

  const handleSubmit = React.useCallback(
    async () => {
      try {
        const amount = +(value || 0)
        if (amount > balance || amount <= 0) {
          return message.error('金额不对')
        }
        setBetting(true)
        await ScatterService.transfer(
          contract,
          `${amount.toFixed(4)} EOS`,
          team,
        )
        const currentGame = await getCurrentGame()
        unstable_batchedUpdates(() => {
          dispatch({
            type: 'SET_BALANCE',
            balance: balance - amount,
          })
          dispatch({
            type: 'SET_CURRENT_GAME',
            currentGame,
          })
          dispatch({
            type: 'SET_LAST_BET_TIME',
            lastBetTime: Date.now(),
          })
          props.onClose()
        })
      } catch (error) {
        message.error(error.message)
      } finally {
        setBetting(false)
      }
    },
    [balance, team, value]
  )

  return (
    <Modal
      title='投注'
      okText='确定'
      cancelText='取消'
      visible={props.visible}
      onCancel={props.onClose}
      onOk={handleSubmit}
      okButtonProps={{
        loading: betting,
      }}>
      <Form>
        <Form.Item label='队伍'>
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
        <Form.Item label='数量'>
          <InputNumber
            placeholder={`可用 ${balance} EOS`}
            className={classes.input}
            value={value}
            onChange={handleValueChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BetFormModal


import * as React from 'react'
import { Button } from 'antd'
import { useTrigger } from 'src/hooks'
import Form from './Form'
import classes from './BetModal.scss'

const BetModal: React.FC = () => {
  const trigger = useTrigger()

  return (
    <>
      <Button
        size='large'
        type='primary'
        icon='plus'
        shape='circle'
        className={classes.trigger}
        onClick={trigger.open}
      />
      <Form
        visible={trigger.value}
        onClose={trigger.close}
      />
    </>
  )
}

export default BetModal


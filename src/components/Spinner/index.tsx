import * as React from 'react'
import { Spin } from 'antd'
import classes from './Spinner.scss'

interface SpinnerProps {
  loading?: boolean
}

const Spinner: React.FC<SpinnerProps> = props => {
  return (
    <div className={classes.container}>
      <Spin spinning={props.loading}/>
    </div>
  )
}

export default Spinner
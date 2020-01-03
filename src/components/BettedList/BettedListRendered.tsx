import * as React from 'react'
import * as types from 'src/types'
import { Table, Button } from 'antd'
import { formatTime } from 'src/utils'
import { UserBetted } from 'src/types'
import classes from './BettedList.scss'

interface BettedListRenderedProps {
  loading: boolean
  bettedList: types.UserBetted[]
  onClaimReward: () => void
}

const BettedListRendered: React.FC<BettedListRenderedProps> = props => {
  const columns = React.useMemo(
    () => ([
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '当前收益',
        dataIndex: 'reward',
        key: 'reward',
      },
      {
        title: '总收益',
        dataIndex: 'totalreward',
        key: 'totalreward',
      },
      {
        title: '操作',
        align: 'right' as 'right',
        dataIndex: 'claim_time',
        key: 'claim_time',
        render(item: UserBetted) {
          if (item.claim_time) {
            return formatTime(item.claim_time)
          }
          return (
            <Button onClick={props.onClaimReward}>领取</Button>
          )
        }
      },
    ]),
    [props.onClaimReward]
  )
  
  return (
    <Table
      rowKey='name'
      pagination={false}
      loading={props.loading}
      className={classes.list}
      dataSource={props.bettedList}
      columns={columns}
    />
  )
}

export default BettedListRendered
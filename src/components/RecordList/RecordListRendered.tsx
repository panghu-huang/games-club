import * as React from 'react'
import * as types from 'src/types'
import { Table } from 'antd'
import { formatTime } from 'src/utils'
import classes from './RecordList.scss'

interface RecordListProps {
  gameId: number
  records: types.Record[]
}

const RecordList: React.FC<RecordListProps> = props => {
  const columns = React.useMemo(
    () => ([
      {
        title: '用户',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: '队伍',
        dataIndex: 'winner',
        key: 'winner',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: '时间',
        align: 'right' as 'right',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render(time: number) {
          return formatTime(time)
        }
      },
    ]),
    []
  )
  
  return (
    <Table
      rowKey='id'
      pagination={false}
      className={classes.list}
      dataSource={props.records}
      columns={columns}
    />
  )
}

export default React.memo(RecordList, (prevProps, nextProps) => {
  return prevProps.records.length === nextProps.records.length
    && prevProps.gameId === nextProps.gameId
})
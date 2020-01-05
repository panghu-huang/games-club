import * as React from 'react'
import * as types from 'src/types'
import { Table, Button } from 'antd'
import { formatTime } from 'src/utils'
import classes from './RecordList.scss'

interface RecordListProps {
  loading: boolean
  hasMore: boolean
  gameId: number
  records: types.Record[]
  onLoadMore: () => void
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

  const footer = React.useCallback(
    () => {
      if (!props.hasMore) {
        return null
      }
      return (
        <div style={{ textAlign: 'center' }}>
          <Button 
            loading={props.loading}
            onClick={props.onLoadMore}>
            加载更多
          </Button>
        </div>
      )
    },
    [props.onLoadMore, props.loading, props.hasMore]
  )
  
  return (
    <Table
      rowKey='id'
      pagination={false}
      className={classes.list}
      dataSource={props.records}
      columns={columns}
      footer={footer}
    />
  )
}

export default React.memo(RecordList, (prevProps, nextProps) => {
  return prevProps.records.length === nextProps.records.length
    && prevProps.gameId === nextProps.gameId
    && prevProps.loading === nextProps.loading
})
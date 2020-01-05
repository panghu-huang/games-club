import * as React from 'react'
import * as types from 'src/types'
import { message } from 'antd'
import { useTrigger } from 'src/hooks'
import { useStore } from 'src/store'
import { getGameRecords } from 'src/api'
import RecordListRendered from './RecordListRendered'

interface RecordListProps {
  hasMore: boolean
  records: types.Record[]
}

const RecordList: React.FC<RecordListProps> = props => {
  const { currentGame, lastBetTime } = useStore()
  const [records, setRecords] = React.useState(props.records)
  const loadingTrigger = useTrigger()
  const isMounted = React.useRef(false)
  const hasMore = React.useRef(props.hasMore)

  const loadMore = React.useCallback(
    async () => {
      try {
        loadingTrigger.open()
        const lastId = records[records.length - 1].id
        const newRecords = await getGameRecords(
          currentGame.id,
          lastId
        )

        hasMore.current = newRecords.more
        setRecords(previousRecords => {
          return previousRecords.concat(newRecords.rows)
        })
      } catch (error) {
        message.error(error.message)
      } finally {
        loadingTrigger.close()
      }
    },
    [currentGame.id, records]
  )
  
  React.useEffect(
    () => {
      if (isMounted.current) {
        getGameRecords(currentGame.id)
          .then(records => {
            hasMore.current = records.more
            setRecords(records.rows)
          })
          .catch(err => {
            message.error(err.message)
          })
      } else {
        isMounted.current = true
      }
    },
    [currentGame.id, lastBetTime]
  )

  return (
    <RecordListRendered
      hasMore={hasMore.current}
      loading={loadingTrigger.value}
      gameId={currentGame.id}
      onLoadMore={loadMore}
      records={records}
    />
  )
}

export default React.memo(RecordList, () => true)
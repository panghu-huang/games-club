import * as React from 'react'
import * as types from 'src/types'
import { message } from 'antd'
import { useStore } from 'src/store'
import { getGameRecords } from 'src/api'
import RecordListRendered from './RecordListRendered'

interface RecordListProps {
  records: types.Record[]
}

const RecordList: React.FC<RecordListProps> = props => {
  const { currentGame, lastBetTime } = useStore()
  const [records, setRecords] = React.useState(props.records)
  const isMounted = React.useRef(false)
  
  React.useEffect(
    () => {
      if (isMounted.current) {
        getGameRecords(currentGame.id)
          .then(records => {
            setRecords(records)
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
      gameId={currentGame.id}
      records={records}
    />
  )
}

export default React.memo(RecordList, () => true)
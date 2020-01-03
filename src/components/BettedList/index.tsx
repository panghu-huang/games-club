import * as React from 'react'
import { getBettedList, claimReward } from 'src/api'
import { useStore } from 'src/store'
import { UserBetted } from 'src/types'
import Rendered from './BettedListRendered'

const BettedList: React.FC = () => {
  const { account, lastBetTime, currentGame } = useStore()
  const [bettedList, setBettedList] = React.useState<UserBetted[]>([])
  const [loading, setLoading] = React.useState(false)

  const fetchBettedList = React.useCallback(
    async (account: string) => {
      try {
        setLoading(true)
        const list = await getBettedList(account)
        setBettedList(list)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const claim = React.useCallback(
    async () => {
      try {
        await claimReward(currentGame.id, account as string)
        await fetchBettedList(account as string)
      } catch (error) {
        console.log(error)
      }
    },
    [account, currentGame.id]
  )

  React.useEffect(
    () => {
      if (account) {
        fetchBettedList(account)
      }
    },
    [account, lastBetTime]
  )

  if (account) {
    return (
      <Rendered
        loading={loading}
        bettedList={bettedList}
        onClaimReward={claim}
      />
    )
  }
  return null
}

export default BettedList
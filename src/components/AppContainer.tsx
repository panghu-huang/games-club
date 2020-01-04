import * as React from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { message } from 'antd'
import { ScatterService } from 'src/services'
import { useDispatch, useStore } from 'src/store'

const AppContainer: React.FC = props => {
  const { account } = useStore()
  const dispatch = useDispatch()

  const login = React.useCallback(
    async () => {
      try {
        await ScatterService.login()
      } catch (error) {
        message.error(error.message)
      }
    },
    []
  )

  React.useEffect(
    () => {
      const raceTimer = setTimeout(login, 2000)
      
      document.addEventListener('scatterLoaded', () => {
        clearTimeout(raceTimer)
        login()
      })
      
      ScatterService.on('login', (identity: any) => {
        if (identity?.accounts.length) {
          const account = identity.accounts[0]

          dispatch({
            type: 'SET_ACCOUNT',
            account: account.name,
          })
        }
      })

      ScatterService.on('logout', () => {
        unstable_batchedUpdates(() => {
          dispatch({
            type: 'SET_ACCOUNT',
            account: null,
          })
          dispatch({
            type: 'SET_BALANCE',
            balance: 0,
          })
        })
      })
    },
    [dispatch]
  )
  
  React.useEffect(
    () => {
      if (account) {
        ScatterService.getEOSBalance(account)
          .then(([balance]: string[]) => {
            dispatch({
              type: 'SET_BALANCE',
              balance: +(balance.split(' ')[0] || 0),
            })
          })
      }
    },
    [account]
  )

  return (
    <>{props.children}</>
  )
}

export default AppContainer
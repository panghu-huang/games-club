import * as React from 'react'
import { message } from 'antd'
import { useStore } from 'src/store'
import { ScatterService } from 'src/services'
import classes from './PageHeader.scss'

const PageHeader: React.FC = () => {
  const { account } = useStore()
  const toggleLogin = React.useCallback(
    async (evt: React.MouseEvent) => {
      try {
        evt.preventDefault()
        if (!account) {
          await ScatterService.login()
        } else {
          ScatterService.logout()
        }
      } catch (error) {
        message.error(error.message)
      }
    },
    [account]
  )

  return (
    <header className={classes.header}>
      <h1 className={classes.title}>Games Club</h1>
      <a href="" onClick={toggleLogin}>{account || 'Login'}</a>
    </header>
  )
}

export default PageHeader
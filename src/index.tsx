import { render } from 'server-renderer'
import GameScoreApp from './App'

render({
  container: '#root',
  App: GameScoreApp as any,
})
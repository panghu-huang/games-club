import * as React from 'react'
import { useStore } from 'src/store'
import TeamCard from './TeamCard'
import classes from './GameTeams.scss'

const GameTeams: React.FC = () => {
  const { currentGame: game } = useStore()

  return React.useMemo(
    () => (
      <div className={classes.container}>
        <TeamCard 
          isWin={game.winner === game.redteam}
          title={game.redteam}
          userCount={game.rusercount}
          amount={game.ramount}
        />
        <span className={classes.vs}>VS</span>
        <TeamCard 
          isWin={game.winner === game.blueteam}
          title={game.blueteam}
          userCount={game.busercount}
          amount={game.bamount}
        />
      </div>
    ),
    [game.id, game.ramount, game.bamount]
  )
}

export default GameTeams
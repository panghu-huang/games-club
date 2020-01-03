import * as React from 'react'
import { Card, Tag, Statistic } from 'antd'

interface TeamCardProps {
  title: string
  amount: string
  userCount: number
  isWin?: boolean
}

const TeamCard: React.FC<TeamCardProps> = props => {
  const winnerTag = props.isWin 
    ? <Tag color='#108ee9'>Winner</Tag> 
    : null

  return (
    <Card
      bordered={true} 
      title={props.title}
      extra={winnerTag}>
      <Statistic
        title={`共 ${props.userCount} 人投注`}
        value={props.amount}
      />
    </Card>
  )
}

export default TeamCard
import { Time } from 'src/config'

export function formatTime(time: number) {
  const date = new Date(time * Time.Second)
  const dateString = date.toISOString().slice(0, 10)
  const timeString = date.toTimeString().slice(0, 8)

  return `${dateString} ${timeString}`
}

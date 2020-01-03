import { Time } from 'src/config'

export function formatTime(time: number) {
  const date = new Date(time * Time.Second)
  const dateString = date.toISOString().slice(0, 10)
  const timeString = date.toTimeString().slice(0, 8)

  return `${dateString} ${timeString}`
}

export function formatError(error: any): string {
  if ('string' === typeof error) {
    try {
      const errorMsg = JSON.parse(error)
      if (errorMsg.code && errorMsg.error) {
        // EOS 链上报的错
        const { details } = errorMsg.error
        return details[0].message
      }
    } catch (unUseError) {
      return error + ''
    }
  }
  
  return formatError(error.message)
}
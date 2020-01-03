import * as React from 'react'
import { formatError } from 'src/utils'

interface ErrorMessageProps {
  error: any
}

const ErrorMessage: React.FC<ErrorMessageProps> = props => {
  const message = formatError(props.error)

  return (
    <p style={{ textAlign: 'center' }}>{message}</p>
  )
}

export default ErrorMessage
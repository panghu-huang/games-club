import * as React from 'react'

export function useTrigger(initialValue = false) {
  const [value, setValue] = React.useState(initialValue)

  const open = React.useCallback(
    () => setValue(true),
    []
  )
  const close = React.useCallback(
    () => setValue(false),
    []
  )

  return {
    value,
    open,
    close,
  }
}
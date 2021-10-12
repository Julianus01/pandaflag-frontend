import { Dispatch, SetStateAction, useState, useEffect } from 'react'

export function usePropState<T>(prop: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(prop)

  useEffect(() => {
    setState(prop)
  }, [prop])

  return [state, setState]
}

export default usePropState

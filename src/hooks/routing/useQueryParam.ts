import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { useMemo } from 'react'

function useQueryParam(name: string) {
  const params = qs.parse(useLocation().search)
  const param = params[name]

  return useMemo(() => param, [param])
}

export default useQueryParam

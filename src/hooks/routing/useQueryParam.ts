import { useLocation } from 'react-router-dom'
import qs from 'query-string'

function useQueryParam(name: string) {
  const params = qs.parse(useLocation().search)
  return params[name]
}

export default useQueryParam

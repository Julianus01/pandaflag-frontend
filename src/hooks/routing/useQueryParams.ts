import { useLocation } from 'react-router-dom'
import qs from 'query-string'

export enum TryApiParam {
  open = '1',
  closed = '0',
}

export enum QueryParam {
  tryApi = 'tryApi',
  email = 'email',

  // Organization page stripe
  success = 'success',
  productId = 'productId',
}

function useQueryParams() {
  return qs.parse(useLocation().search)
}

export default useQueryParams

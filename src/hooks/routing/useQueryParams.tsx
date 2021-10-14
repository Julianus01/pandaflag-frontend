import { useLocation } from 'react-router-dom'

export enum QueryParam {
  project = 'pn',
  environment = 'env',
}

function useQueryParams(): URLSearchParams {
  return new URLSearchParams(useLocation().search)
}

export default useQueryParams

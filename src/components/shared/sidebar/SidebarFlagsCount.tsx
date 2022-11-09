import { Tag } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import FlagsApi from 'api/FlagsApi'
import { useQuery } from 'react-query'

function SidebarFlagsCount() {
  const project = useSelector((state: IStoreState) => state.configuration.project)
  const flagsQuery = useQuery([ApiQueryId.getFlags, project?.id], FlagsApi.getFlags)

  if (!flagsQuery.data || flagsQuery.data?.length <= 1) {
    return null
  }

  return <Tag fontSize="xs">{flagsQuery.data?.length}</Tag>
}

export default SidebarFlagsCount

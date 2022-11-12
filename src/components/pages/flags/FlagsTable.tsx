import {
  Tbody,
  Th,
  Tr,
  Tag,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverBody,
  Box,
  Icon,
  IconButton,
} from '@chakra-ui/react'
import { IDbEnvironment } from 'api/EnvironmentsApi'
import { IFlag } from 'api/FlagsApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useEnvironmentReorder } from '../environments/hooks/useEnvironmentReorder'
import FlagRow from './FlagRow'

interface IProps {
  flags: IFlag[]
}

function FlagsTable({ flags }: IProps) {
  const environmentsReorder = useEnvironmentReorder()
  const environments = environmentsReorder.environments as IDbEnvironment[]

  return (
    <Table size="md" variant="simple">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">Name</Th>

          {environments.map((environment: IDbEnvironment, index) => (
            <Th p="0" isNumeric key={environment.id} textTransform="lowercase">
              <Popover placement="top" trigger="hover">
                <Box display="flex" justifyContent="flex-end">
                  <PopoverTrigger>
                    <Box p="3">
                      <Tag size="sm" variant="subtle" colorScheme={environment?.color}>
                        #{environment.name}
                      </Tag>
                    </Box>
                  </PopoverTrigger>
                </Box>

                <PopoverContent w="auto" _focus={{ boxShadow: 'none', outline: 'none' }}>
                  <PopoverBody p="0" display="flex" alignItems="center" shadow="lg">
                    <Box p="2" display="flex" alignItems="center" justifyContent="center">
                      <IconButton
                        disabled={index === 0}
                        onClick={() => environmentsReorder.moveHigher(index)}
                        aria-label="move-left"
                        icon={<Icon as={FiArrowLeft} />}
                      />
                    </Box>

                    <Box p="2" display="flex" alignItems="center" justifyContent="center">
                      <IconButton
                        disabled={index === environments.length - 1}
                        onClick={() => environmentsReorder.moveLower(index)}
                        aria-label="move-right"
                        icon={<Icon as={FiArrowRight} />}
                      />
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Th>
          ))}

          <Th />
        </Tr>
      </Thead>

      <Tbody>
        {flags.map((flag: IFlag) => (
          <FlagRow key={flag.id} flag={flag} />
        ))}
      </Tbody>
    </Table>
  )
}

export default FlagsTable

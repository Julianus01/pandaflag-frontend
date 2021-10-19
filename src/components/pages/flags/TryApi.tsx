import {
  Box,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from '@chakra-ui/react'
import { IFlag } from 'api/FlagsApi'
import { useState } from 'react'
import { AiOutlineApi } from 'react-icons/ai'
import { FiChevronDown, FiPlay } from 'react-icons/fi'
import CommonUtils from 'utils/CommonUtils'

interface IProps {
  flags: IFlag[]
}

function TryApi({ flags }: IProps) {
  const [selected, setSelected] = useState<string>('All Flags')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function runApi() {
    setIsLoading(true)
    await CommonUtils.wait()
    setIsLoading(false)
  }

  return (
    <Accordion allowToggle>
      <AccordionItem isDisabled={isLoading} border="none">
        <h2>
          <AccordionButton _hover={{ background: 'transparent' }} _focus={{ boxShadow: 'none', outline: 'none' }}>
            <Icon strokeWidth={2.4} as={AiOutlineApi} />

            <Box fontWeight="semibold" fontSize="sm" ml={2} flex="1" textAlign="left">
              Try api
            </Box>

            <AccordionIcon />
          </AccordionButton>
        </h2>

        <AccordionPanel pb={4}>
          <Text color="gray.500">
            Test out the api endpoints below and inspect what kind of response will be retrieved
          </Text>

          <Text mb={4} color="gray.500">
            Pick for which flag you'd like to run the test below
          </Text>

          <Box display="flex">
            <Menu>
              <MenuButton
                disabled={isLoading}
                size="sm"
                as={Button}
                rightIcon={<Icon strokeWidth={2.4} as={FiChevronDown} />}
              >
                {selected}
              </MenuButton>

              <MenuList>
                <MenuItem onClick={() => setSelected('All Flags')}>All Flags</MenuItem>

                {flags.map((flag: IFlag) => (
                  <MenuItem key={flag.id} onClick={() => setSelected(flag.name)}>
                    {flag.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Button
              onClick={runApi}
              isLoading={isLoading}
              disabled={isLoading}
              loadingText="Running"
              size="sm"
              ml="auto"
              rightIcon={<Icon strokeWidth={2.4} as={FiPlay} />}
            >
              Run
            </Button>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default TryApi

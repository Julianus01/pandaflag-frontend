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
  Code,
} from '@chakra-ui/react'
import { IFlag } from 'api/FlagsApi'
import { useState } from 'react'
import { AiOutlineApi } from 'react-icons/ai'
import { FiChevronDown, FiPlay } from 'react-icons/fi'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
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
    <Accordion defaultIndex={0} allowToggle>
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

          <Box mb={4} display="flex">
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
              colorScheme="blue"
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

          <Text mb={2} fontSize="sm">
            Request
          </Text>
          <CodeContainer mb={4}>
            <Code>fetch('https://jsonplaceholder.typicode.com/todos/1')</Code>
            <Code>{`  .then(response => response.json())`}</Code>
            <Code>{`  .then(json => console.log(json))`}</Code>
          </CodeContainer>

          {!isLoading && (
            <>
              <Text mb={2} fontSize="sm">
                Response
              </Text>
              <CodeContainer>
                <Code>{`{`}</Code>
                <Code>{`  "test": {`}</Code>
                <Code>{`    "enabled": false,`}</Code>
                <Code>{`    "value": null`}</Code>
                <Code>{`  }`}</Code>
                <Code>{`}`}</Code>
              </CodeContainer>
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default TryApi

const CodeContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[200])(theme)};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  padding: ${({ theme }) => theme.space[2]};

  > code {
    background: transparent;
    white-space: pre;
  }
`

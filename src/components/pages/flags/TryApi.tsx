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
  MenuList,
  Button,
  Code,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverBody,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react'
import { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import useQueryParam from 'hooks/routing/useQueryParam'
import { QueryParam, TryApiParam } from 'hooks/routing/useQueryParams'
import { useEffect, useState } from 'react'
import { AiOutlineApi } from 'react-icons/ai'
import { FiChevronDown, FiInfo, FiPlay } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import CommonUtils from 'utils/CommonUtils'

interface IProps {
  flags: IFlag[]
  isOpen: boolean
}

const ALL_FLAGS_SELECTION = 'All Flags'

function mapFlagForResponse(flag: IFlag | undefined) {
  if (!flag) {
    return {}
  }

  return {
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
    environmentName: flag.environmentName,
  }
}

function mapFlagsForResponse(flags: IFlag[]) {
  return flags.map(mapFlagForResponse)
}

function TryApi({ flags, isOpen }: IProps) {
  const history = useHistory()
  const configuration = useSelector((state: IStoreState) => state.configuration)

  const [response, setResponse] = useState<IFlag[] | IFlag | undefined>(undefined)
  const [selected, setSelected] = useState<string>(ALL_FLAGS_SELECTION)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const selectedFlag = flags.find((flag: IFlag) => flag.name === selected)

  useEffect(() => {
    if (selected !== ALL_FLAGS_SELECTION) {
      const foundSelected = flags.find((flag: IFlag) => flag.name === selected)

      if (!foundSelected) {
        setSelected(ALL_FLAGS_SELECTION)
        setResponse(undefined)
      }
    }
  }, [flags, selected])

  useEffect(() => {
    setSelected(ALL_FLAGS_SELECTION)
    setResponse(undefined)
  }, [configuration.environment?.name])

  async function runApi() {
    setIsLoading(true)
    await CommonUtils.wait()

    if (selected === ALL_FLAGS_SELECTION) {
      setResponse(flags)
    } else {
      const foundSelected = flags.find((flag: IFlag) => flag.name === selected)
      setResponse(foundSelected)
    }

    setIsLoading(false)
  }

  function onAccordionChange(index: number) {
    const nextAccordionState = index === 0 ? TryApiParam.open : TryApiParam.closed
    history.replace(`${RoutePage.flags()}?${QueryParam.tryApi}=${nextAccordionState}`)
  }

  return (
    <Accordion allowToggle onChange={onAccordionChange} index={isOpen ? 0 : -1}>
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
          <Text fontSize="sm" color="gray.500">
            Test out the api endpoints below and inspect what kind of response will be retrieved
          </Text>

          <Box display="flex" fontSize="sm" color="gray.500">
            The endpoint is built using the project's api key{' '}
            <Box display="flex" alignItems="center">
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Box display="flex" ml={0.5}>
                    <Icon cursor="pointer" as={FiInfo} w={4} h={4} />
                  </Box>
                </PopoverTrigger>

                <PopoverContent _focus={{ boxShadow: 'none', outline: 'none' }}>
                  <PopoverBody shadow="lg" p="4">
                    <PopoverText fontSize="sm">
                      Every project has an Api Key.
                      <br />
                      <br />
                      This key is being used when calling the REST API in order to get your flags information. You
                      current's project key can be found below
                      <br />
                      <br />
                      <RouteLink to={RoutePage.projects()}>Your projects api keys</RouteLink>
                    </PopoverText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
            , project, environment and flag name.
          </Box>

          <Text mb={4}>
            <Code>
              https://smartlaunch.com/
              <Box color="orange.500" as="span">
                API_KEY
              </Box>
              /
              <Box color="teal.500" as="span">
                ENVIRONMENT
              </Box>
              /
            </Code>
          </Text>

          <Text fontSize="sm" mb={4} color="gray.500">
            Pick for which flag you'd like to run the test below
          </Text>

          <Box mb={4} display="flex">
            <Menu autoSelect={false}>
              <MenuButton
                disabled={isLoading}
                size="sm"
                as={Button}
                rightIcon={<Icon strokeWidth={2.4} as={FiChevronDown} />}
              >
                {selected}
              </MenuButton>

              <MenuList>
                <MenuOptionGroup
                  fontWeight="semibold"
                  onChange={(value) => setSelected(value as string)}
                  value={selected}
                  type="radio"
                  title="Flags"
                >
                  <MenuItemOption value={ALL_FLAGS_SELECTION}>{ALL_FLAGS_SELECTION}</MenuItemOption>

                  {flags.map((flag: IFlag) => (
                    <MenuItemOption key={flag.id} value={flag.name}>
                      {flag.name}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
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
            <Code>
              fetch('https://smartlaunch.com/
              {
                <Box color="orange.500" as="span">
                  {configuration.project?.apiKey}
                </Box>
              }
              /
              {
                <Box as="span" color="teal.500">
                  {configuration.environment?.name}
                </Box>
              }
              /
              {selected !== ALL_FLAGS_SELECTION && (
                <Box as="span" color="blue.500">
                  {selectedFlag?.name}
                </Box>
              )}
              ')
            </Code>
            <Code>{`  .then(response => response.json())`}</Code>
            <Code>{`  .then(json => console.log(json))`}</Code>
          </CodeContainer>

          {Boolean(response) && (
            <>
              <Text mb={2} fontSize="sm">
                Response
              </Text>

              <CodeContainer>
                {Array.isArray(response) && (
                  <JsonCode $loading={isLoading}>{JSON.stringify(mapFlagsForResponse(flags), null, 2)}</JsonCode>
                )}

                {!Array.isArray(response) && (
                  <JsonCode $loading={isLoading}>
                    {JSON.stringify(mapFlagForResponse(response), Object.keys(response as IFlag).sort(), 2)}
                  </JsonCode>
                )}
              </CodeContainer>
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

interface RootProps {
  flags: IFlag[]
}

function Root(props: RootProps) {
  const tryParam = useQueryParam(QueryParam.tryApi) as TryApiParam

  if (!Object.values(TryApiParam).includes(tryParam)) {
    return <Redirect to={`${RoutePage.flags()}?${QueryParam.tryApi}=${TryApiParam.closed}`} />
  }

  return <TryApi isOpen={tryParam === TryApiParam.open} {...props} />
}

export default Root

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

const RouteLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue[400]};
  text-decoration: underline;
`

const PopoverText = styled(Text)`
  color: ${({ theme }) => applyColorMode(theme.colors.gray[800], theme.colors.whiteAlpha[900])(theme)};
`

const JsonCode = styled(Code)`
  opacity: ${({ $loading }) => ($loading ? 0.4 : 1)};
`

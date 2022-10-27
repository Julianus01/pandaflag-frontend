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
  useClipboard,
  useToast,
} from '@chakra-ui/react'
import { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import useQueryParam from 'hooks/routing/useQueryParam'
import { QueryParam, TryApiParam } from 'hooks/routing/useQueryParams'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineApi } from 'react-icons/ai'
import { FiChevronDown, FiClipboard, FiInfo, FiPlay } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import BaseApi from 'api/BaseApi'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { IDbEnvironment } from 'api/EnvironmentsApi'
import { SplitbeeEvent } from 'utils/SplitbeeUtils'

interface IProps {
  flags: IFlag[]
  isOpen: boolean
}

const ALL_FLAGS_SELECTION = 'All Flags'

function mapFlagForResponse(flag: any) {
  if (!flag) {
    return {}
  }

  return {
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
  }
}

function mapFlagsForResponse(flags: IFlag[]) {
  return flags.map(mapFlagForResponse)
}

function getDefaultSelectedEnvironment(environments: IDbEnvironment[] | undefined): string {
  if (environments?.length) {
    return environments[0].name
  }

  return ''
}

function TryApi({ flags, isOpen }: IProps) {
  const toast = useToast()
  const history = useHistory()
  const configuration = useSelector((state: IStoreState) => state.configuration)
  const { data: environments } = useContext(EnvironmentsContext)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<IFlag[] | IFlag | undefined>(undefined)
  const [selected, setSelected] = useState<string>(ALL_FLAGS_SELECTION)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>(getDefaultSelectedEnvironment(environments))

  const { hasCopied, onCopy } = useClipboard(
    `fetch('${process.env.REACT_APP_PANDAFLAG_API_URL}/${configuration.project?.apiKey}/${selectedEnvironment}/${
      selected !== ALL_FLAGS_SELECTION ? selected : ''
    }')
    .then(response => response.json())
    .then(json => console.log(json))
  `
  )

  useEffect(() => {
    if (selected !== ALL_FLAGS_SELECTION) {
      const foundSelected = flags.find((flag: IFlag) => flag.name === selected)

      if (!foundSelected) {
        setSelected(ALL_FLAGS_SELECTION)
        setResponse(undefined)
      }
    }
  }, [flags, selected])

  async function runApi() {
    try {
      setIsLoading(true)

      if (selected === ALL_FLAGS_SELECTION) {
        const flagsResponse = await BaseApi.getFlags(selectedEnvironment)
        setResponse(flagsResponse)
      } else {
        const flagResponse = await BaseApi.getFlag(selected, selectedEnvironment)
        setResponse(flagResponse)
      }

      setIsLoading(false)
    } catch {
      toast({
        title: `An error has occured`,
        isClosable: true,
        variant: 'subtle',
        status: 'error',
      })

      setIsLoading(false)
    }
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
            , environment and flag name.
          </Box>

          <CodeContainer mt={1} mb={4}>
            <Code display="flex" flexWrap="wrap">
              {process.env.REACT_APP_PANDAFLAG_API_URL}/
              <Box color="orange.500" as="span">
                API_KEY
              </Box>
              /
              <Box color="teal.500" as="span">
                ENVIRONMENT
              </Box>
              /
              <Box color="blue.500" as="span">
                FLAG_NAME
              </Box>
            </Code>
          </CodeContainer>

          <Text fontSize="sm" mb={4} color="gray.500">
            Pick for which flag you'd like to run the test below
          </Text>

          <Box mb={4} display="flex">
            <Box mr={2}>
              <Menu autoSelect={false}>
                <MenuButton disabled={isLoading} as={Button} rightIcon={<Icon strokeWidth={2.4} as={FiChevronDown} />}>
                  {selectedEnvironment}
                </MenuButton>

                <MenuList maxHeight="300px" overflowY={`overlay` as any}>
                  <MenuOptionGroup
                    fontWeight="semibold"
                    onChange={(value) => setSelectedEnvironment(value as string)}
                    value={selectedEnvironment}
                    type="radio"
                    title="Environment"
                  >
                    {environments?.map((environment: IDbEnvironment) => (
                      <MenuItemOption key={environment.id} value={environment.name}>
                        {environment.name}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Box>

            <Menu autoSelect={false}>
              <MenuButton disabled={isLoading} as={Button} rightIcon={<Icon strokeWidth={2.4} as={FiChevronDown} />}>
                {selected}
              </MenuButton>

              <MenuList maxHeight="300px" overflowY={`overlay` as any}>
                <MenuOptionGroup
                  fontWeight="semibold"
                  onChange={(value) => setSelected(value as string)}
                  value={selected}
                  type="radio"
                  title="Flag"
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
              data-splitbee-event={SplitbeeEvent.RunTryApi}
              colorScheme="blue"
              onClick={runApi}
              isLoading={isLoading}
              disabled={isLoading}
              loadingText="Running"
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
            <Code display="flex" flexWrap="wrap">
              fetch('{process.env.REACT_APP_PANDAFLAG_API_URL}/
              {
                <Box color="orange.500" as="span">
                  {configuration.project?.apiKey}
                </Box>
              }
              /
              {
                <Box as="span" color="teal.500">
                  {selectedEnvironment}
                </Box>
              }
              /
              {selected !== ALL_FLAGS_SELECTION && (
                <Box as="span" color="blue.500">
                  {selected}
                </Box>
              )}
              ')
            </Code>
            <Code>{`  .then(response => response.json())`}</Code>
            <Code>{`  .then(json => console.log(json))`}</Code>

            <ClipboardContainer>
              <Button
                data-splitbee-event={SplitbeeEvent.CopyTryApiCode}
                onClick={onCopy}
                leftIcon={<Icon as={FiClipboard} />}
                size="xs"
              >
                {hasCopied ? 'Copied' : 'Copy'}
              </Button>
            </ClipboardContainer>
          </CodeContainer>

          {Boolean(response) && (
            <>
              <Text mb={2} fontSize="sm">
                Response
              </Text>

              <CodeContainer>
                {Array.isArray(response) && (
                  <JsonCode $loading={isLoading}>
                    {JSON.stringify(mapFlagsForResponse(response as IFlag[]), null, 2)}
                  </JsonCode>
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
  padding: ${({ theme }) => theme.space[2]};
  max-height: 600px;
  overflow-y: overlay;
  position: relative;

  > code {
    background: transparent;
    white-space: pre;
  }
`

const ClipboardContainer = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
`

const RouteLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue[500]};

  text-decoration: underline;
`

const PopoverText = styled(Text)`
  color: ${({ theme }) => applyColorMode(theme.colors.gray[800], theme.colors.whiteAlpha[900])(theme)};
`

const JsonCode = styled(Code)`
  opacity: ${({ $loading }) => ($loading ? 0.4 : 1)};
`

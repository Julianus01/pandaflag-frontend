import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormErrorMessage,
  Text,
  Box,
  useColorModeValue,
  Icon,
  useToast,
} from '@chakra-ui/react'
import { ChangeEvent, useState, KeyboardEvent, useContext } from 'react'
import _ from 'lodash/fp'
import EnvironmentsApi, { EnvironmentColor, IEnvironment } from 'api/EnvironmentsApi'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { FiCheck } from 'react-icons/fi'
import { SplitbeeEvent } from 'utils/SplitbeeUtils'
import { useMutation, useQueryClient } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import { useUpdateEffect } from 'react-use'

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

interface ColorOption {
  value: string
  label: string
  color: string
}

function getColorOptions(environments: IEnvironment[]): ColorOption[] {
  const options = Object.keys(EnvironmentColor).map((color) => ({
    value: color,
    label: capitalizeFirstLetter(color),
    color: `${color}.400`,
  }))

  const allColorsHaveBeenUsed = environments?.length >= Object.keys(EnvironmentColor).length
  if (allColorsHaveBeenUsed) {
    return options
  }

  const unusedOptions = options.filter((colorOption) => {
    const alreadyInUse = Boolean(environments.find((environment) => environment.color === colorOption.value))
    return !alreadyInUse
  })

  return unusedOptions
}

interface IProps {
  isOpen: boolean
  onClose: () => void
}

function CreateEnvironmentModal({ isOpen, onClose }: IProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { data: environments } = useContext(EnvironmentsContext)
  const colorOptions = getColorOptions(environments as IEnvironment[])
  const [environmentName, setEnvironmentName] = useState<string>('')
  const [color, setColor] = useState<EnvironmentColor>(colorOptions[0].value as EnvironmentColor)
  const [error, setError] = useState<string | undefined>(undefined)

  const itemHoverAndActiveBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  const createEnvironmentMutation = useMutation(EnvironmentsApi.createEnvironment, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getEnvironments)
      queryClient.invalidateQueries(ApiQueryId.getFlags)
      queryClient.invalidateQueries(ApiQueryId.getFlag)
      queryClient.invalidateQueries(ApiQueryId.getFlagByName)

      toast({
        title: `Created environment successfully 👍`,
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
      onClose()
    },
  })

  useUpdateEffect(() => {
    if (!isOpen) {
      setEnvironmentName('')
      setColor(colorOptions[0].value as EnvironmentColor)
      setError(undefined)
    }
  }, [isOpen, colorOptions])

  function onEnvironmentNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setEnvironmentName(value)

    if (error) {
      setError(undefined)
    }
  }

  function formatEnvironmentSnakeCase() {
    setEnvironmentName(_.snakeCase(environmentName))
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && environmentName.length >= 3) {
      formatEnvironmentSnakeCase()
      createEnvironment()
    }
  }

  function doesEnvironmentAlreadyExist(name: string): boolean {
    const found = environments?.find((environment) => environment.name.toLowerCase() === name.toLowerCase())

    return Boolean(found)
  }

  function createEnvironment() {
    const name = _.snakeCase(environmentName)

    if (doesEnvironmentAlreadyExist(name)) {
      setError('An environment with this name already exists')
      return
    }

    createEnvironmentMutation.mutate({ name, color })
  }

  return (
    <Modal
      closeOnOverlayClick={!createEnvironmentMutation.isLoading}
      motionPreset="slideInBottom"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Add Environment</ModalHeader>

        <ModalBody>
          <Text color="gray.500" mb={2} fontSize="sm">
            Environment will be transformed into <i>snake_case</i> for easy api access
          </Text>

          <FormControl mb={2} isInvalid={Boolean(error)}>
            <Input
              disabled={createEnvironmentMutation.isLoading}
              onBlur={formatEnvironmentSnakeCase}
              onKeyDown={onKeyDown}
              value={environmentName}
              onChange={onEnvironmentNameChange}
              variant="filled"
              placeholder="Ex: very_safe_environment"
            />

            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          <Box>
            {colorOptions.map((colorOption) => (
              <Box
                onClick={() => setColor(colorOption.value as EnvironmentColor)}
                bg={colorOption.value === color ? itemHoverAndActiveBg : 'transparent'}
                borderRadius="md"
                cursor="pointer"
                _hover={{ background: itemHoverAndActiveBg }}
                p="2"
                key={colorOption.value}
                display="flex"
                alignItems="center"
              >
                <Box mr="4" shadow="md" borderRadius="md" w="7" h="7" background={colorOption.color} />

                <Text>{colorOption.label}</Text>

                {colorOption.value === color && <Icon mr="2" ml="auto" strokeWidth={2.4} as={FiCheck} />}
              </Box>
            ))}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            data-splitbee-event={SplitbeeEvent.CreateEnvironment}
            onClick={createEnvironment}
            loadingText="Adding Environment"
            disabled={environmentName.length < 3 || createEnvironmentMutation.isLoading}
            colorScheme="primary"
            isLoading={createEnvironmentMutation.isLoading}
          >
            Add Environment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateEnvironmentModal

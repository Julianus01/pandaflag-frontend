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

const ColorOptions: ColorOption[] = Object.keys(EnvironmentColor).map((color) => ({
  value: color,
  label: capitalizeFirstLetter(color),
  color: `${color}.400`,
}))

interface IProps {
  environment: IEnvironment
  isOpen: boolean
  onClose: () => void
}

function EditEnvironmentModal({ environment, isOpen, onClose }: IProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { data: environments } = useContext(EnvironmentsContext)
  const [environmentName, setEnvironmentName] = useState<string>(environment.name)
  const [color, setColor] = useState<EnvironmentColor>(environment.color)
  const [error, setError] = useState<string | undefined>(undefined)

  const itemHoverAndActiveBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  const updateEnvironmentMutation = useMutation(EnvironmentsApi.updateEnvironment, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getEnvironments)
      queryClient.invalidateQueries(ApiQueryId.getFlags)
      queryClient.invalidateQueries(ApiQueryId.getFlag)
      queryClient.invalidateQueries(ApiQueryId.getFlagByName)

      toast({
        title: `Updated environment successfully 👍`,
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
      onClose()
    },
  })

  useUpdateEffect(() => {
    if (isOpen) {
      setEnvironmentName(environment.name)
      setColor(environment.color)
    }
  }, [environment, isOpen])

  useUpdateEffect(() => {
    if (!isOpen) {
      setEnvironmentName('')
      setColor(ColorOptions[0]?.value as EnvironmentColor)
      setError(undefined)
    }
  }, [isOpen])

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
      updateEnvironment()
    }
  }

  function sameNameAsOtherEnvironment(name: string): boolean {
    if (name === environment.name) {
      return false
    }

    const found = environments?.find((environment) => environment.name.toLowerCase() === name.toLowerCase())

    return Boolean(found)
  }

  function updateEnvironment() {
    const name = _.snakeCase(environmentName)

    if (sameNameAsOtherEnvironment(name)) {
      setError('An environment with this name already exists')
      return
    }

    updateEnvironmentMutation.mutate({ id: environment.id, name, color })
  }

  const disabledEdit =
    environmentName.length < 3 ||
    updateEnvironmentMutation.isLoading ||
    (environmentName.trim() === environment.name.trim() && color === environment.color)

  return (
    <Modal
      closeOnOverlayClick={!updateEnvironmentMutation.isLoading}
      motionPreset="slideInBottom"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Edit Environment</ModalHeader>

        <ModalBody>
          <Text color="gray.500" mb={2} fontSize="sm">
            Environment will be transformed into <i>snake_case</i> for easy api access
          </Text>

          <FormControl mb={2} isInvalid={Boolean(error)}>
            <Input
              disabled={updateEnvironmentMutation.isLoading}
              onBlur={formatEnvironmentSnakeCase}
              onKeyDown={onKeyDown}
              value={environmentName}
              onChange={onEnvironmentNameChange}
              variant="filled"
              placeholder="Ex: very_safe_environment"
            />

            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          <Box display="grid" gridTemplateColumns="1fr" gridGap="1">
            {ColorOptions.map((colorOption) => (
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
                <Box mr="4" shadow="md" borderRadius="md" w="6" h="6" background={colorOption.color} />

                <Text>{colorOption.label}</Text>

                {colorOption.value === color && <Icon mr="2" ml="auto" strokeWidth={2.4} as={FiCheck} />}
              </Box>
            ))}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            data-splitbee-event={SplitbeeEvent.UpdateEnvironment}
            onClick={updateEnvironment}
            loadingText="Updating"
            disabled={disabledEdit}
            colorScheme="primary"
            isLoading={updateEnvironmentMutation.isLoading}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditEnvironmentModal

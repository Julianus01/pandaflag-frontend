import { Box, Icon, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react'
import { AiOutlineApi } from 'react-icons/ai'

function TryApi() {
  return (
    <Accordion allowToggle>
      <AccordionItem border="none">
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default TryApi

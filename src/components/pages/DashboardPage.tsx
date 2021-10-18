import { Box, Grid, Heading, Text } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

function DashboardPage() {
  return (
    <BoxedPage>
      <Heading mb={10} as="h3" size="lg">
        Dashboard
      </Heading>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Statistic w="100%">
          <Heading mb={4} as="h4" size="xl">
            4
          </Heading>

          <Text>Projects</Text>
        </Statistic>

        <Statistic w="100%">
          <Heading mb={4} as="h4" size="xl">
            2
          </Heading>

          <Text>Environments</Text>
        </Statistic>

        <Statistic w="100%">
          <Heading mb={4} as="h4" size="xl">
            8
          </Heading>

          <Text>Flags</Text>
        </Statistic>
      </Grid>
    </BoxedPage>
  )
}

export default DashboardPage

const Statistic = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[900])(theme)};
  padding: ${({ theme }) => theme.space[14]};
`

import { useToast } from '@chakra-ui/react'
import { ReactNode, useMemo } from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'

interface IProps {
  children: ReactNode
}

function ReactQueryProvider({ children }: IProps) {
  const toast = useToast()

  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
      queryCache: new QueryCache({
        onError: () => {
          toast({ title: 'Ups, something went wrong 😔' })
        },
      }),
    })
  }, [toast])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default ReactQueryProvider

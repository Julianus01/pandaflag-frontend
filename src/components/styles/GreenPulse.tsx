import { Box } from '@chakra-ui/react'
import styled from 'styled-components/macro'

const GreenPulse = styled(Box)<{ $show: boolean }>`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  display: block;
  width: 10px;
  height: 10px;
  margin-right: ${({ theme }) => theme.space[4]};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.green[500]};
  cursor: pointer;
  box-shadow: 0 0 0 rgba(56, 161, 105, 0.4);
  animation: pulse 2s infinite;
  transition: opacity 0.15s ease-in-out;

  @-webkit-keyframes pulse {
    0% {
      -webkit-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4);
    }
    70% {
      -webkit-box-shadow: 0 0 0 10px rgba(56, 161, 105, 0);
    }
    100% {
      -webkit-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
    }
  }

  @keyframes pulse {
    0% {
      -moz-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4);
      box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4);
    }
    70% {
      -moz-box-shadow: 0 0 0 10px rgba(56, 161, 105, 0);
      box-shadow: 0 0 0 10px rgba(56, 161, 105, 0);
    }
    100% {
      -moz-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
      box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
    }
  }
`

export default GreenPulse

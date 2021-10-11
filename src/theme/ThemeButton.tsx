import { useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import styled from 'styled-components/macro'
import { CSSTransition } from 'react-transition-group'
import { useColorMode } from '@chakra-ui/color-mode'
import { Icon } from '@chakra-ui/react'

const ANIMATION_DURATION = 200

const ThemeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const [inProp, setInProp] = useState(false)
  const [localTheme, setLocalTheme] = useState(colorMode)

  const onClick = () => {
    toggleColorMode()

    setInProp(true)
    setTimeout(() => {
      if (localTheme === 'light') {
        setLocalTheme('dark')
      } else {
        setLocalTheme('light')
      }

      setInProp(false)
    }, ANIMATION_DURATION)
  }

  return (
    <Container onClick={onClick}>
      <Transition in={inProp} timeout={ANIMATION_DURATION} classNames="icon">
        {localTheme === 'light' ? <Icon w={5} h={5} as={FiMoon} /> : <Icon w={5} h={5} as={FiSun} />}
      </Transition>
    </Container>
  )
}

export default ThemeButton

// SC
const Container = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
`

const Transition = styled(CSSTransition)`
  &.icon-enter {
    transform: scale(1);
  }

  &.icon-enter-active {
    transform: scale(0);
    transition: transform ${ANIMATION_DURATION}ms;
  }

  &.icon-exit {
    transform: scale(0);
  }

  &.icon-exit-active {
    transform: scale(1);
    transition: transform ${ANIMATION_DURATION}ms;
  }
`

import { useState, useEffect, useRef } from 'react'

const DefaultDuration = 5000

export const useTemporaryMessage = (duration: number = DefaultDuration) => {
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [message, setMessage] = useState('')

  const showMessage = (message: string) => {
    messageTimerRef.current && clearTimeout(messageTimerRef.current)

    setMessage(message)
    messageTimerRef.current = setTimeout(() => setMessage(''), duration)
  }

  const hideMessage = () => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current)
      messageTimerRef.current = null
      setMessage('')
    }
  }

  useEffect(() => {
    return () => {
      messageTimerRef.current && clearTimeout(messageTimerRef.current)
    }
  }, [])

  return { message, showMessage, hideMessage }
}

import { Textarea, TextareaProps } from '@chakra-ui/textarea'
import React, { useState, useEffect, useRef } from 'react'

function AutoTextArea(props: TextareaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState('')
  const [textAreaHeight, setTextAreaHeight] = useState('auto')
  const [parentHeight, setParentHeight] = useState('auto')

  useEffect(() => {
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
    setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`)
  }, [text])

  function onChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextAreaHeight('auto')
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
    setText(event.target.value)

    if (props.onChange) {
      props.onChange(event)
    }
  }

  return (
    <div style={{ minHeight: parentHeight }}>
      <Textarea fontSize="md" {...props} ref={textAreaRef} rows={5} style={{ height: textAreaHeight }} onChange={onChangeHandler} />
    </div>
  )
}

export default AutoTextArea

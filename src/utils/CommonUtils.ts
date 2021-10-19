import { KeyboardEvent, MouseEvent } from 'react'

function stopPropagation(
  event: Event | KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLDivElement>
) {
  event.stopPropagation()
}

function wait(time: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const CommonUtils = {
  stopPropagation,
  wait,
}

export default CommonUtils

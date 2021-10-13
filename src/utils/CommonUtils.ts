import { KeyboardEvent, MouseEvent } from 'react'

function stopPropagation(
  event: Event | KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLDivElement>
) {
  event.stopPropagation()
}

const CommonUtils = {
  stopPropagation,
}

export default CommonUtils

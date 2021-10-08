import { KeyboardEvent, MouseEvent } from "react"

function stopPropagation(event: Event | KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>) {
  event.stopPropagation()
}

const CommonUtils = {
  stopPropagation
}

export default CommonUtils
import { KeyboardEvent } from "react"

function stopPropagation(event: Event | KeyboardEvent<HTMLInputElement>) {
  event.stopPropagation()
}

const CommonUtils = {
  stopPropagation
}

export default CommonUtils
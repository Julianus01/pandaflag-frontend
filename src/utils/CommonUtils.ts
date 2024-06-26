import { KeyboardEvent, MouseEvent } from 'react'

export enum FeatureFlag {
  feedbackAndBugsLink = 'feedback_and_bugs_github_link',
  tryApi = 'try_api',
}

export enum NodeEnvironment {
  development = 'development',
  production = 'production',
}

function stopPropagation(
  event: Event | KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLDivElement>
) {
  event.stopPropagation()
}

function wait(time: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function isNodeEnvironment(nodeEnvironment: NodeEnvironment) {
  return process.env.REACT_APP_STAGE === nodeEnvironment
}

const CommonUtils = {
  stopPropagation,
  wait,
  isNodeEnvironment,
}

export default CommonUtils

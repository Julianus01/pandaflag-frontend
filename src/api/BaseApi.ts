import store from 'redux/store'
import { IFlag } from './FlagsApi'
import { IEnvironment, IProject } from './ProjectsApi'

async function getFlags(): Promise<IFlag[]> {
  const project = store.getState().configuration.project as IProject
  const environment = store.getState().configuration.environment as IEnvironment

  const response = await fetch(
    `${process.env.REACT_APP_PANDAFLAG_API_URL as string}/${project.apiKey}/${environment.name}/`
  )

  const responseJSON = await response.json()
  return responseJSON
}

async function getFlag(flagName: string): Promise<IFlag> {
  const project = store.getState().configuration.project as IProject
  const environment = store.getState().configuration.environment as IEnvironment

  const response = await fetch(
    `${process.env.REACT_APP_PANDAFLAG_API_URL as string}/${project.apiKey}/${environment.name}/${flagName}`
  )

  const responseJSON = await response.json()
  return responseJSON
}

const BaseApi = {
  getFlags,
  getFlag,
}

export default BaseApi

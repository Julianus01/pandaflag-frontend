import store from 'redux/store'
import { IEnvironment } from './EnvironmentsApi'
import { IFlag } from './FlagsApi'
import { IProject } from './ProjectsApi'

async function getFlags(): Promise<IFlag[]> {
  // TODO:
  return []
  // const project = store.getState().configuration.project as IProject
  // const environment = store.getState().configuration.environment as IEnvironment

  // const response = await fetch(
  //   `${process.env.REACT_APP_PANDAFLAG_API_URL as string}/${project.apiKey}/${environment.name}/`
  // )

  // const responseJSON = await response.json()
  // return responseJSON
}

async function getFlag(flagName: string): Promise<IFlag | undefined> {
  // TODO:
  return undefined
  // const project = store.getState().configuration.project as IProject
  // const environment = store.getState().configuration.environment as IEnvironment

  // const response = await fetch(
  //   `${process.env.REACT_APP_PANDAFLAG_API_URL as string}/${project.apiKey}/${environment.name}/${flagName}`
  // )

  // const responseJSON = await response.json()
  // return responseJSON
}

const BaseApi = {
  getFlags,
  getFlag,
}

export default BaseApi

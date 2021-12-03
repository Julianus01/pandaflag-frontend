import store from 'redux/store'
import { IFlag } from './FlagsApi'
import { IProject } from './ProjectsApi'

async function getFlags(environmentName: string): Promise<IFlag[]> {
  const project = store.getState().configuration.project as IProject

  const response = await fetch(
    `${process.env.REACT_APP_PANDAFLAG_API_URL as string}/${project.apiKey}/${environmentName}/`
  )

  const responseJSON = await response.json()
  return responseJSON
}

async function getFlag(flagName: string, environmentName: string): Promise<IFlag> {
  const project = store.getState().configuration.project as IProject

  const response = await fetch(
    `${process.env.REACT_APP_PANDAFLAG_API_URL as string}/${project.apiKey}/${environmentName}/${flagName}`
  )

  const responseJSON = await response.json()
  return responseJSON
}

const BaseApi = {
  getFlags,
  getFlag,
}

export default BaseApi

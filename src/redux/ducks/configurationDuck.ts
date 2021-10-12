import createReducer from '../utils/createReducer'
import { PayloadAction } from 'redux/types'
import { IEnvironment, IProject } from 'api/ProjectsApi'
import LSUtils from 'utils/LSUtils'

// Types
const CHANGE_PROJECT = '[configuration] CHANGE_PROJECT'
const CHANGE_ENVIRONMENT = '[configuration] CHANGE_ENVIRONMENT'

export interface IConfigurationState {
  project: IProject | undefined,
  environment: IEnvironment | undefined
}

const initialState: IConfigurationState = {
  project: undefined,
  environment: undefined
}

// Reducer
export default createReducer(initialState)({
  [CHANGE_PROJECT]: (state: IConfigurationState, { payload: project }: PayloadAction<IProject>) => ({
    ...state,
    project
  }),

  [CHANGE_ENVIRONMENT]: (state: IConfigurationState, { payload: environment }: PayloadAction<IEnvironment>) => ({
    ...state,
    environment
  })
})

// Actions
const configurationActions = {
  changeProject: (project: IProject) => {
    LSUtils.saveLastProjectName(project.name)
    return { type: CHANGE_PROJECT, payload: project }
  },

  changeEnvironment: (environment: IEnvironment) => {
    LSUtils.saveLastEnvironmentName(environment.name)
    return { type: CHANGE_ENVIRONMENT, payload: environment }
  }
}

export { configurationActions }
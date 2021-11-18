import createReducer from '../utils/createReducer'
import { PayloadAction } from 'redux/types'
import { IEnvironment, IProject } from 'api/ProjectsApi'
import LSUtils from 'utils/LSUtils'
import { IOrganization } from 'api/OrganizationApi'

// Types
const types = {
  SET_ORGANIZATION: '[configuration] SET_ORGANIZATION',
  SET_ENVIRONMENT: '[configuration] SET_ENVIRONMENT',
  SET_PROJECT: '[configuration] SET_PROJECT',
}

export interface IConfigurationState {
  organization: IOrganization | undefined
  project: IProject | undefined
  environment: IEnvironment | undefined
}

const initialState: IConfigurationState = {
  organization: undefined,
  project: undefined,
  environment: undefined,
}

// Reducer
export default createReducer(initialState)({
  [types.SET_ORGANIZATION]: (state: IConfigurationState, { payload: organization }: PayloadAction<IOrganization>) => ({
    ...state,
    organization,
  }),

  [types.SET_PROJECT]: (state: IConfigurationState, { payload: project }: PayloadAction<IProject>) => ({
    ...state,
    project,
  }),

  [types.SET_ENVIRONMENT]: (state: IConfigurationState, { payload: environment }: PayloadAction<IEnvironment>) => ({
    ...state,
    environment,
  }),
})

// Actions
const actions = {
  setOrganization: (organization: IOrganization) => {
    return { type: types.SET_ORGANIZATION, payload: organization }
  },

  setProject: (project: IProject) => {
    LSUtils.saveLastProjectName(project.name)
    return { type: types.SET_PROJECT, payload: project }
  },

  setEnvironment: (environment: IEnvironment) => {
    LSUtils.saveLastEnvironmentName(environment.name)
    return { type: types.SET_ENVIRONMENT, payload: environment }
  },
}

export { types as configurationTypes }
export { actions as configurationActions }

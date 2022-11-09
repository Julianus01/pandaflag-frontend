import createReducer from '../utils/createReducer'
import { PayloadAction } from 'redux/types'
import { IProject } from 'api/ProjectsApi'
import LSUtils from 'utils/LSUtils'
import { IOrganization } from 'api/OrganizationsApi'

// Types
const types = {
  SET_ORGANIZATION: '[configuration] SET_ORGANIZATION',
  SET_PROJECT: '[configuration] SET_PROJECT',
}

export interface IConfigurationState {
  organization: IOrganization | undefined
  project: IProject | undefined
}

const initialState: IConfigurationState = {
  organization: undefined,
  project: undefined,
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
})

// Actions
const actions = {
  setOrganization: (organization: IOrganization | undefined) => {
    return { type: types.SET_ORGANIZATION, payload: organization }
  },

  setProject: (project: IProject | undefined) => {
    if (project?.name) {
      LSUtils.saveLastProjectName(project.name)
    }

    return { type: types.SET_PROJECT, payload: project }
  },
}

export { types as configurationTypes }
export { actions as configurationActions }

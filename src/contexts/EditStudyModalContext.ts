// Externals
import { createContext } from 'react'
// Locals
import { STUDY__DYNAMODB } from '@/utils'
import { EditStudyModalContextType } from './types'


const INIT_EDIT_STUDY_MODAL_CONTEXT: EditStudyModalContextType = {
  showEditStudyModal: '',
  setShowEditStudyModal: () => {},
  handleOpenEditStudyModal: () => {},
}


export const EditStudyModalContext = createContext<EditStudyModalContextType>(
  INIT_EDIT_STUDY_MODAL_CONTEXT
)
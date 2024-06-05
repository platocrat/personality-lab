// Externals
import { createContext } from 'react'
// Locals
import { STUDY__DYNAMODB } from '@/utils'
import { EditStudyModalContextType } from './types'


export const EditStudyModalContext = createContext<EditStudyModalContextType>({
  showEditStudyModal: null,
  handleOpenEditStudyModal: null
})
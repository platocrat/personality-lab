// Externals
import { createContext } from 'react'
// Local
import { StudiesTableContextType } from './types'


const INIT_STUDIES_TABLE_CONTEXT = {
  buttonHandlers: {
    toggleDropdown: () => {},
    buttonHref: () => '',
    handleDeleteStudy: () => {},
  }
}


export const StudiesTableContext = createContext<StudiesTableContextType>(
  INIT_STUDIES_TABLE_CONTEXT
)
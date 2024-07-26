// Externals
import { createContext } from 'react'
// Local
import { StudiesTableContextType } from './types'


export const StudiesTableContext = createContext<StudiesTableContextType>({
  buttonHandlers: null
})
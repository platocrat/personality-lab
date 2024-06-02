'use client'

// Externals
import { ReactNode, createContext, useContext, useLayoutEffect } from 'react'
import { AnimatePresence, motion, useMotionTemplate } from 'framer-motion'
// Locals
import useProgress from '@/hooks/useProgress'
import styles from '@/components/Progress/ProgressBar/ProgressBar.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



export const ProgressBarContext = createContext<ReturnType<
  typeof useProgress
> | null>(null)




export function useProgressBar() {
  let progress = useContext(ProgressBarContext)

  if (progress === null) {
    throw new Error('Need to be inside provider')
  }

  return progress
}



const ProgressBar = ({ children }: { children: ReactNode }) => {
  let progress = useProgress()
  let width = useMotionTemplate`${progress.value}%`


  useLayoutEffect(() => {
    console.log(`progress.state: `, progress.state)
  }, [ progress.state ])


  return (
    <ProgressBarContext.Provider value={ progress }>
      <AnimatePresence onExitComplete={ progress.reset }>
        { progress.state !== 'complete' && (
          <motion.div
            style={{ 
              width,
              height: '4px',
              position: 'absolute',
              zIndex: '100',
              backgroundColor: 'rgb(0, 123, 194, 1)',
            }}
            exit={{ opacity: 0 }}
          />
        ) }
      </AnimatePresence>

      { children }
    </ProgressBarContext.Provider>
  )
}


export default ProgressBar
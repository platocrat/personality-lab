// Externals
import html2canvas from 'html2canvas'
import React, { FC, ReactNode, Ref, useRef } from 'react'
// Locals
// Contexts
import { definitelyCenteredStyle } from '@/theme/styles'



type ScreenshotTypes = {
  children: ReactNode
  ref: any,
}



const Screenshot: FC<ScreenshotTypes> = ({
  ref,
  children,
}) => {
  return (
    <div ref={ ref }>
      { children }
    </div>
  )
}


export default Screenshot
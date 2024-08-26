// Externals
import React, { FC, useState } from 'react'
// Locals
// CSS
import styles from './Tooltip.module.css'



type TooltipProps = {
  text: string
  children: React.ReactNode
}


const Tooltip: FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div
      onMouseEnter={ () => setVisible(true) }
      onMouseLeave={ () => setVisible(false) }
    >
      { children }
      { visible && (
        <div className={ styles.tooltip }>
          <div className={ styles.tooltipContent }>{ text }</div>
        </div>
      ) }
    </div>
  )
}

export default Tooltip
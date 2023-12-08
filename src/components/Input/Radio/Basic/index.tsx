// Externals
import { FC, Fragment, ReactNode } from 'react'


type BasicRadioInputProps = {
  input: ReactNode
  label: string | ReactNode
  css: {
    pClassName: string,
    spanClassName: string,
  }
}


const BasicRadioInput: FC<BasicRadioInputProps> = ({ css, label, input }) => {
  return (
    <>
      <p className={ css.pClassName }>
        <span className={ css.spanClassName }>
          { label }
          { input }
        </span>
      </p>    
    </>
  )
}

export default BasicRadioInput
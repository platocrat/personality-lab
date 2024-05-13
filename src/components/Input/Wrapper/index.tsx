// Externals
import { CSSProperties, FC, Fragment, ReactNode } from 'react'


type InputWrapperProps = {
  input: ReactNode
  label: string | ReactNode
  options?: {
    splitLabelAndInput?: boolean 
    classNames?: {
      pClassName?: string,
      spanClassName?: string,
    }
    css?: {
      p?: CSSProperties
      splitLabel?: CSSProperties,
      splitInput?: CSSProperties,
    }
  }
}



const InputWrapper: FC<InputWrapperProps> = ({ 
  label, 
  input,
  options, 
}) => {
  return (
    <>
      <p 
        style={ options?.css?.p }
        className={ options?.classNames?.pClassName }
      >
        { options?.splitLabelAndInput ? (
          <>
            <div style={ options?.css?.splitLabel }>
              { label }
            </div>
            <div style={ options?.css?.splitInput }>
              { input }
            </div>
          </>
        ) : (
          <>
            <span className={ options?.classNames?.spanClassName }>
              { label }
              { input }
            </span>
          </>
        ) }

      </p>    
    </>
  )
}


export default InputWrapper
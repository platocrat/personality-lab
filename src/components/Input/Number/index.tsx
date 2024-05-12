// Externals
import { CSSProperties, FC, ReactNode, useContext } from 'react'
// Locals
// Utils
import { INVALID_CHARS_FOR_NUMBERS } from '@/utils'



type NumberInputProps = {
  name: string
  style?: CSSProperties
  onChange: (e: any) => void
  children?: ReactNode | undefined
  controls?: {
    min?: number
    step?: number
  }
}




const NumberInput: FC<NumberInputProps> = ({ 
  name,
  style,
  children,
  controls,
  onChange,
}) => {
  return (
    <>
      <input
        type='number'
        name={ name }
        min={ controls?.min ?? 0 }
        required={ true }
        step={ controls?.step ?? 1 }
        onChange={ (e: any) => onChange(e) }
        style={ { 
          ...style ?? undefined,
          margin: '0px 4px 0px 12px'
        } }
        onKeyDown={ (e: any): any => {
          if (INVALID_CHARS_FOR_NUMBERS.includes(e.key)) {
            e.preventDefault()
          }
        } }
      />
      { children }
    </>
  )
}


export default NumberInput
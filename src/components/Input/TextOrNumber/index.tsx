// Externals
import { CSSProperties, ReactNode, FC } from 'react'
// Locals
import { INVALID_CHARS_WITH_NUMBERS } from '@/utils'



type TextOrNumberInputProps = {
  name: string
  style?: CSSProperties
  onChange: (e: any) => void
  children?: ReactNode | undefined
  controls?: {
    type?: 'text' | 'number'
    min?: number
    step?: number
  }
}



const TextOrNumberInput: FC<TextOrNumberInputProps> = ({
  name,
  style,
  controls,
  onChange,
  children,
}) => {
  return (
    <>
      <input
        name={ name }
        required={ true }
        type={ controls?.type }
        min={ controls?.min ?? 0 }
        step={ controls?.step ?? 1 }
        onChange={ (e: any) => onChange(e) }
        style={ {
          ...style ?? undefined,
          margin: '0px 4px 0px 12px'
        } }
        onKeyDown={ (e: any): any => {
          if (INVALID_CHARS_WITH_NUMBERS.includes(e.key)) {
            e.preventDefault()
          }
        } }
      />
      { children }
    </>
  )
}


export default TextOrNumberInput
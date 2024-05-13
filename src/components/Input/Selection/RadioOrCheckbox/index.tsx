// Externals
import { 
  FC, 
  Fragment, 
  ReactNode, 
  Dispatch, 
  CSSProperties, 
  SetStateAction,
} from 'react'
// Locals
import { InputLabelType } from '../types'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type RadioOrCheckboxInputProps = {
  inputName: string
  itemIndex?: number
  inputLabels: InputLabelType[]
  style?: {
    outerWrapper?: CSSProperties
    questionBodyStyle?: CSSProperties
    radioButtonInputStyle?: CSSProperties
    radioButtonLabelStyle?: CSSProperties
  }
  onChange: (e: any, i: number) => void
  legend?: string | ReactNode | undefined
  options?: {
    isVertical?: boolean
    type?: 'checkbox' | 'radio'
  }
}


const RadioOrCheckboxInput: FC<RadioOrCheckboxInputProps> = ({ 
  style,
  legend,
  options,
  onChange,
  inputName, 
  itemIndex,
  inputLabels,
}) => {
  const isInputLengthLong = inputLabels.length > 3

  const labelDisplay = isInputLengthLong ? 'flex' : 'block'
  const radioButtonWrapperMargin = isInputLengthLong ? '2px' : ''
  const questionBodyDisplay = isInputLengthLong
    ? options?.isVertical 
      ? 'block' 
      : 'flex'
    : ''

  function fragmentKey(inputLabel: InputLabelType, i: number): string {
    return `bubble-radio-input-id-${inputLabel.id}-${inputLabel.name}-${i}` 
  }

  function inputId(
    inputLabel: InputLabelType, 
    itemIndex: number, 
    i: number
  ): string {
    const prefix = `${inputLabel.name}-inputId-${inputLabel.id}`
    const suffix = `-itemIndex${itemIndex}-index${i}` 
    return prefix + suffix
  }


  return (
    <>
      <fieldset 
        style={{ 
          ...style?.outerWrapper,
          border: 'none',
        }}
      >
        <legend>
          { typeof legend === 'string' ? <p>{ legend }</p> : legend } 
        </legend>
        <div 
          id='QuestionBody'
          className={ styles.questionBody }
          style={{ 
            ...style?.questionBodyStyle,
            display: questionBodyDisplay,
          }}
        >
          { 
            inputLabels.map(( 
              inputLabel: InputLabelType, 
              i: number
            ) => (
              <Fragment key={ fragmentKey(inputLabel, i) }>
                <div 
                  className={ 
                    options?.isVertical ? '' : styles.radioButtonWrapper 
                  }
                  style={ { 
                    margin: radioButtonWrapperMargin,
                    marginBottom: '8px',
                    fontSize: '15px',
                    background: 'rgba(0,0,0,.06)',
                    borderRadius: '3rem',
                  }}
                >
                  <label 
                    className={ styles.radioButtonLabel }
                    style={{ 
                      ...style?.radioButtonLabelStyle,
                      display: labelDisplay,
                     }}
                  >
                    <input
                      value={ i }
                      required={ true }
                      name={ inputName }
                      type={ options?.type ?? 'radio' }
                      className={ styles.radioButtonInput }
                      id={ inputId(inputLabel, itemIndex ?? 0, i) }
                      style={{ ...style?.radioButtonInputStyle }}
                      onChange={ (e: any) => onChange(e, i) }
                    />
                    { inputLabel.name }
                  </label>
                </div>
              </Fragment>
            )) 
          }
        </div>
      </fieldset>
      <br />
    </>
  )
}

export default RadioOrCheckboxInput
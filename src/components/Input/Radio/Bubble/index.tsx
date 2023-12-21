// Externals
import { FC, Fragment, ReactNode, Dispatch, SetStateAction } from 'react'
// Locals
import { InputLabelType } from '../types'
// CSS
import styles from '@/app/page.module.css'



type BubbleRadioInputProps = {
  inputName: string
  inputLabels: InputLabelType[]
  onChange: (e: any, i: number) => void
  legend?: string | ReactNode | undefined
  itemIndex?: number
  options?: {
    isVertical?: boolean
  }
}


const BubbleRadioInput: FC<BubbleRadioInputProps> = ({ 
  legend,
  options,
  onChange,
  inputName, 
  itemIndex,
  inputLabels,
}) => {
  const _itemIndex = itemIndex ?? 0
  
  const isInputLengthLong = inputLabels.length > 3

  const labelDisplay = isInputLengthLong ? 'flex' : 'block'
  const radioButtonWrapperMargin = isInputLengthLong ? '2px' : ''
  const questionBodyDisplay = isInputLengthLong
    ? options?.isVertical 
      ? 'block' 
      : 'flex'
    : ''

  function fragmentKey(inputLabel: InputLabelType, i: number): string {
    return `bubble-radio-input-id${inputLabel.inputId}-${inputLabel.labelName}-${i}` 
  }

  function inputId(
    inputLabel: InputLabelType, 
    itemIndex: number, 
    i: number
  ): string {
    const prefix = `${inputLabel.labelName}-inputId${inputLabel.inputId}`
    const suffix = `-itemIndex${itemIndex}-index${i}` 
    return prefix + suffix
  }


  return (
    <>
      <fieldset style={ { border: 'none' } }>
        <legend>
          { typeof legend === 'string' ? <p>{ legend }</p> : legend } 
        </legend>
        <div 
          id='QuestionBody' 
          className={ styles.questionBody }
          style={{ display: questionBodyDisplay }}
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
                    style={{ display: labelDisplay }}
                  >
                    <input
                      onChange={ (e: any) => onChange(e, _itemIndex) }
                      required={ true }
                      className={ styles.radioButtonInput }
                      type='radio'
                      id={ inputId(inputLabel, _itemIndex, i) }
                      name={ inputName }
                      // Use `i + 1` because we cannot sum a value of `0`
                      value={ itemIndex ? i + 1 : i }
                    />
                    { inputLabel.labelName }
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

export default BubbleRadioInput
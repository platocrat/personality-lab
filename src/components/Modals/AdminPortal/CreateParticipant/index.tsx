// Externals
import { FC } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
// Styles
import styles from '@/app/page.module.css'
import modalStyle from '@/components/Modals/Modal.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import Spinner from '@/components/Suspense/Spinner'



type CreateParticipantModalProps = {
  modalRef: any
  state: {
    isModalVisible: boolean
    isWaitingForResponse: boolean
  }
  onClick: (e: any) => void
  onChange: {
    onNameChange: (e: any) => void
    onEmailChange: (e: any) => void
    onNobelLaureateChange: (e: any) => void
  }

}


const TITLE = `Enter the full name of the participant you want to add`
const NOBLE_LAUREATE_TEXT = `Is this participant a Nobel Laureate?`
const BUTTON_TEXT = `Create Participant`

const inputs = [
  { 
    name: `name`,
    placeholder: `Name`,
  },
  { 
    name: `email`,
    placeholder: `Email`,
  }
]



const CreateParticipantModal: FC<CreateParticipantModalProps> = ({
  onClick,
  onChange,
  modalRef,
  state,
}) => {
  return (
    <>
      { state.isModalVisible && (
        <>
          <div 
            ref={ modalRef }
            className={ `${modalStyle.modal} ${modalStyle.background}` }
            style={{
              ...definitelyCenteredStyle,
              flexDirection: 'column',
              gap: '24px',
              width: '65%',
              height: '50%',
              maxWidth: '350px',
              maxHeight: '500px',
              textAlign: 'center'
            }}
          >
            {/* Title */}
            <div style={{ width: '300px', marginBottom: '12px' }}>
              <h3>{ TITLE }</h3>
            </div>

            {/* Inputs */}
            { inputs.map((input, i: number) => (
              <>
                <div>
                  <input
                    required
                    type={ 'text' }
                    name={ input.name }
                    // className=''
                    // id={ `${ i }` }
                    placeholder={ input.placeholder }
                    onChange={ 
                      i === 0 ? onChange.onNameChange : onChange.onEmailChange 
                    }
                    style={{
                      width: '250px',
                      fontSize: '15px',
                      padding: '4px 8px',
                      borderWidth: '0.5px',
                      borderRadius: '4px',
                      boxShadow: '0px 1px 2px 0.5px inset black',
                    }}
                  />
                </div>
              </>
            )) }

            {/* Check box */}
            <label 
              style={{ 
                ...definitelyCenteredStyle,
                display: 'flex',
                cursor: 'pointer',
              }}
            >
              <p style={{ marginRight: '8px' }}>
                { NOBLE_LAUREATE_TEXT }
              </p>

              <input
                required
                type='checkbox'
                name={ 'is-nobel-laureate' }
                // className=''
                // style={  }
                // id={ `${ i }` }
                onChange={ onChange.onNobelLaureateChange }
              />
            </label>

            {/* Button */}
            { state.isWaitingForResponse
              ? (
                <>
                  <div
                    style={ {
                      ...definitelyCenteredStyle,
                      position: 'relative',
                    } }
                  >
                    <Spinner height='40' width='40' />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={ onClick }
                    style={ { width: '150px', marginTop: '12px' } }
                    className={ styles.button }
                  >
                    { BUTTON_TEXT }
                  </button>
                </>
              )
            }
          </div>
        </>
      )}
    </>
  )
}


export default CreateParticipantModal
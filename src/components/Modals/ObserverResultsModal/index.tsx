// Externals
import { FC, Fragment } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
// Types
import { ParticipantType } from '@/utils'
// Styles
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import modalStyle from '@/components/Modals/Modal.module.css'



type ObserverResultsModalProps = {
  modalRef: any
  isModalVisible: boolean
  onClick: (e: any) => void
  selectedParticipant: ParticipantType | null
}


const BUTTON_TEXT = `View Results`

const title = (name: string) => `For ${ name }, which assessment you would like to see the observer results for?`


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



const ObserverResultsModal: FC<ObserverResultsModalProps> = ({
  onClick,
  modalRef,
  isModalVisible,
  selectedParticipant,
}) => {



  return (
    <>
      { isModalVisible && (
        <>
          <div
            ref={ modalRef }
            style={ {
              ...definitelyCenteredStyle,
              flexDirection: 'column',
              gap: '24px',
              width: '65%',
              height: '50%',
              maxWidth: '400px',
              maxHeight: '500px',
              textAlign: 'center'
            } }
            className={ `${modalStyle.modal} ${modalStyle.background}` }
          >
            {/* Title */ }
            <div style={ { width: '300px', marginBottom: '12px' } }>
              <h3>
                { title(selectedParticipant ? selectedParticipant.name : '') }
              </h3>
            </div>

            {/* Check box */ }
            {/* { assessmentIds.map((assessmentId: string, i: number) => (
              <Fragment key={ i }>
                <label
                  style={ {
                    ...definitelyCenteredStyle,
                    display: 'flex',
                    cursor: 'pointer',
                  } }
                >
                  <p style={ { marginRight: '8px' } }>
                    { assessmentId }
                  </p>

                  <input
                    required
                    type='checkbox'
                    name={ 'select' }
                  // className=''
                  // style={  }
                  // id={ `${ i }` }
                  // onChange={ onChange.onNobelLaureateChange }
                  />
                </label>
              </Fragment>
            )) } */}

            {/* Button */ }
            <button
              onClick={ onClick }
              className={ styles.button }
              style={ { width: '150px', marginTop: '12px' } }
            >
              { BUTTON_TEXT }
            </button>
          </div>
        </>
      ) }
    </>
  )
}


export default ObserverResultsModal
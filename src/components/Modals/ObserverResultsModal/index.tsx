// Externals
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
// Types
import { ParticipantType, RESULTS__DYNAMODB } from '@/utils'
// Styles
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import modalStyle from '@/components/Modals/Modal.module.css'



type ObserverResultsModalProps = {
  modalRef: any
  isModalVisible: boolean
  selectedParticipant: ParticipantType | null
  onEventHandlers: {
    onClick: (e: any) => void
    onViewObserverResultsChange: (e: any, assessmentId: string) => void
  }
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
  modalRef,
  isModalVisible,
  onEventHandlers,
  selectedParticipant,
}) => {
  // States
  const [ assessmentIds, setAssessmentIds] = useState<string[]>([''])


  // ---------------------------- Async functions ------------------------------
  async function getAssessmentIds() {
    try {
      const response = await fetch(
        `/api/assessment/results?email${ selectedParticipant?.email }`, 
        { method: 'GET' }
      )
      const json = await response.json()

      if (response.status === 401) throw new Error(json.error)
      if (response.status === 400) throw new Error(json.error)

      const assessmentIds: string[] = json.data.map(
        (results: RESULTS__DYNAMODB): string => results.id
      )

      setAssessmentIds(assessmentIds)
    } catch (error: any) {
      throw new Error(error)
    }
  }


  useLayoutEffect(() => {
    if (isModalVisible) {
      const requests = [
        getAssessmentIds()
      ]

      Promise.all(requests)
    }
  }, [ ])
  


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
            { assessmentIds.map((assessmentId: string, i: number) => (
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
                    style={{
                      cursor: 'pointer',
                    }}
                    // className=''
                    // id={ `${ i }` }
                    onChange={ 
                      (e: any) => onEventHandlers.onViewObserverResultsChange(
                        e,
                        assessmentId
                      )
                    }
                  />
                </label>
              </Fragment>
            )) }

            {/* Button */ }
            <button
              className={ styles.button }
              style={ { width: '150px', marginTop: '12px' } }
              onClick={ (e: any) => onEventHandlers.onClick(e) }
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
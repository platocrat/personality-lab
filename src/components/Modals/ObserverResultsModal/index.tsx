// Externals
import { 
  FC, 
  useState,
  Fragment, 
  Dispatch, 
  SetStateAction, 
  useLayoutEffect, 
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
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
    onViewObserverResultsChange: (e: any, id: string, name: string) => void
  }
}


type AssessmentToViewType = { 
  id: string
  name: string 
  timestamp: string
}



const BUTTON_TEXT = `View Results`

const title = (name: string) => `For ${ name }, which assessment you would like to see results for?`
const NO_RESULTS_TITLE = 'There are no results for this participant to view'


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

const tableHeaders = [
  'Assessment Name',
  'ID',
  'Date',
  'View?'
]




const ObserverResultsModal: FC<ObserverResultsModalProps> = ({
  modalRef,
  isModalVisible,
  onEventHandlers,
  selectedParticipant,
}) => {
  // States
  const [ assessments, setAssessments] = useState<AssessmentToViewType[]>([])
  const [ 
    isWaitingForAssessments, 
    setIsWaitingForAssessments 
  ] = useState<boolean>(false)
  const [ 
    areNoObserverResultsToView, 
    setAreNoObserverResultsToView 
  ] = useState<boolean>(false)


  // ---------------------------- Async functions ------------------------------
  async function getAssessments() {
    setIsWaitingForAssessments(true)

    try {
      const response = await fetch(
        `/api/assessment/results?email=${ selectedParticipant?.email }`, 
        { method: 'GET' }
      )

      const json = await response.json()


      if (response.status === 404) {
        setIsWaitingForAssessments(false)
        setAreNoObserverResultsToView(true)
        return
      }

      if (response.status === 500) {
        setIsWaitingForAssessments(false)
        throw new Error(json.error)
      }

      const _: AssessmentToViewType[] = json.data.map((
        results: RESULTS__DYNAMODB
      ): AssessmentToViewType => {
        return {
          id: results.id,
          name: results.assessmentName,
          timestamp: new Date(results.timestamp).toDateString()
        } 
      })

      setAssessments(_)
      setIsWaitingForAssessments(false)
    } catch (error: any) {
      setIsWaitingForAssessments(false)
      throw new Error(error)
    }
  }


  useLayoutEffect(() => {
    if (isModalVisible) {
      const requests = [
        getAssessments()
      ]

      Promise.all(requests)
    }
  }, [ isModalVisible ])
  


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
              maxWidth: '600px',
              minWidth: '400px',
              maxHeight: '500px',
              textAlign: 'center'
            } }
            className={ `${modalStyle.modal} ${modalStyle.background}` }
          >
            { areNoObserverResultsToView ? (
              <>
                <div>
                  <h3>{ NO_RESULTS_TITLE }</h3>
                </div>
              </>
            ) : (
              <>
                {/* Title */ }
                <div style={ { width: '300px', marginBottom: '12px' } }>
                  <h3>
                    { title(selectedParticipant ? selectedParticipant.name : '') }
                  </h3>
                </div>

                {/* Check box */ }
                { isWaitingForAssessments ? (
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
                    <div
                      style={{
                        ...definitelyCenteredStyle,
                        width: '100%',
                        overflowX: 'auto',
                      }}
                    >
                      { assessments && (
                            <table style={ { border: '1px solid #f4f4f4' } }>
                          <thead 
                            style={{ 
                                backgroundColor: '#f4f4f4',
                            }}
                          >
                            <tr>
                              { tableHeaders.map((name: string) => (
                                <>
                                  <th
                                    style={{ 
                                      fontSize: '14px',
                                      padding: '8px 24px',
                                    }}
                                  >
                                    { name }
                                  </th>
                                </>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            { assessments.map((_: AssessmentToViewType, i: number) => (
                              <Fragment key={ i }>
                                <tr
                                  key={ i }
                                  className={ styles.radioButtonLabel }
                                  onClick={
                                    (e: any) => {
                                      if (e.target.type !== 'checkbox') {
                                        // Ensure that checkbox is toggled when 
                                        // `tr` element is clicked.
                                        e.preventDefault()
                                        
                                        const checkbox = e.currentTarget.querySelector(
                                          "input[type='checkbox']"
                                        )
                                        
                                        checkbox.checked = !checkbox.checked
                                        
                                        // Call `onChange` handler to select the 
                                        // results to view
                                        onEventHandlers.onViewObserverResultsChange(
                                          e,
                                          _.id,
                                          _.name
                                        )
                                      }
                                    }
                                  }
                                  style={{
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    border: '0.75px solid gray',
                                  }}
                                >
                                  <td
                                    style={ {
                                      width: '125px',
                                      padding: '4px 0px',
                                    } }
                                  >{ _.name }</td>
                                  <td 
                                    style={{
                                      width: '125px',
                                    }}
                                  >
                                    { _.id.slice(0, 8) + '...' }
                                  </td>
                                  <td
                                    style={ {
                                      width: '175px',
                                    } }
                                  >
                                    { _.timestamp }
                                  </td>

                                  <td>
                                    <input
                                      required
                                      type='checkbox'
                                      name={ 'select' }
                                      style={{ 
                                        top: '2px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                      }}
                                      onChange={
                                        (e: any) => {
                                          e.stopPropagation()
                                          onEventHandlers.onViewObserverResultsChange(
                                            e, 
                                            _.id, 
                                            _.name
                                          )
                                        }
                                      }
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            )) }
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* Button */ }
                    <button
                      className={ styles.button }
                      style={ { width: '150px' } }
                      onClick={ (e: any) => onEventHandlers.onClick(e) }
                    >
                      { BUTTON_TEXT }
                    </button>
                  </>
                ) }
              </>
            )}
          </div>
        </>
      ) }
    </>
  )
}


export default ObserverResultsModal
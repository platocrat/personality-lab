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
import ViewResultsModalTableBody from './table-body'
import ViewResultsModalTableHead from './table-head'



type ViewResultsModalProps = {
  modalRef: any
  isModalVisible: boolean
  selectedParticipant: ParticipantType | null
  onEventHandlers: {
    handleOnViewResults: (e: any) => void
    onViewResultsChange: (e: any, id: string, name: string) => void
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



const ViewResultsModal: FC<ViewResultsModalProps> = ({
  modalRef,
  isModalVisible,
  onEventHandlers,
  selectedParticipant,
}) => {
  // States
  const [ 
    isWaitingForAssessments, 
    setIsWaitingForAssessments 
  ] = useState<boolean>(false)
  const [ 
    areNoObserverResultsToView, 
    setAreNoObserverResultsToView 
  ] = useState<boolean>(false)
  // Custom
  const [ assessments, setAssessments] = useState<AssessmentToViewType[]>([])


  // ---------------------------- Async functions ------------------------------
  async function getAssessments() {
    setIsWaitingForAssessments(true)

    try {
      const response = await fetch(
        `/api/assessment/results?email=${ selectedParticipant?.email }`, 
        { method: 'GET' }
      )

      const json = await response.json()


      if (response.status === 200) {
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
        // Update suspense state
        setIsWaitingForAssessments(false)
        // Update state that hides the table
        setAreNoObserverResultsToView(false)
      }  else if (response.status === 404) {
        // Update suspense state
        setIsWaitingForAssessments(false)
        // Update state that hides the table
        setAreNoObserverResultsToView(true)
      } else if (response.status === 500) {
        // Update suspense state
        setIsWaitingForAssessments(false)
        throw new Error(json.error)
      }
    } catch (error: any) {
      // Update suspense state
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
              maxHeight: '400px',
              textAlign: 'center',
            } }
            className={ `${modalStyle.modal} ${modalStyle.background}` }
          >
            { areNoObserverResultsToView === true ? (
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
                      { assessments.length !== 0 ? (
                        <table 
                          style={{ 
                            border: '2px solid #f4f4f4',
                          }}
                        >
                          <ViewResultsModalTableHead />
                          <ViewResultsModalTableBody 
                            assessments={ assessments }
                            onViewResultsChange={ 
                              onEventHandlers.onViewResultsChange 
                            }
                          />
                        </table>
                      ) : null}
                    </div>

                    {/* Button */ }
                    <button
                      className={ styles.button }
                      style={ { width: '150px' } }
                      onClick={ 
                        (e: any) => onEventHandlers.handleOnViewResults(
                          e
                        )
                      }
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


export default ViewResultsModal
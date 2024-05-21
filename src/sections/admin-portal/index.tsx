// Externals
import { 
  FC, 
  useRef, 
  useState,
  Fragment, 
  RefObject,
  CSSProperties,
  useLayoutEffect,
} from 'react'
// Locals
// Sections
import ParticipantsTable from './participants-table'
// Components
import Spinner from '@/components/Suspense/Spinner'
import ObserverResultsModal from '@/components/Modals/ObserverResultsModal'
import DownloadDataModal from '@/components/Modals/AdminPortal/DownloadData'
import CreateParticipantModal from '@/components/Modals/AdminPortal/CreateParticipant'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { 
  ParticipantType, 
  BessiSkillScoresType,
  PARTICIPANT_DYNAMODB,
  getUsernameAndEmailFromCookie,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type AdminPortalProps = {

}


type ShowModalType = 'createParticipantModal' | 'downloadDataModal' |
  'viewObserverResponseModal' | 'viewObserverResultsModal' | null



const PAGE_TITLE = 'Admin Portal'




const AdminPortal: FC<AdminPortalProps> = ({

}) => {
  // Refs
  const modalRef = useRef<any>(null)
  // States
  // Strings
  const [ participantName, setParticipantName ] = useState<string>('')
  const [ participantEmail, setParticipantEmail ] = useState<string>('')
  const [ assessmentNames, setAssessmentNames ] = useState<string[]>([''])
  // Booleans
  const [
    isCreatingParticipant,
    setIsCreatingParticipant
  ] = useState(false)
  const [ 
    isWaitingForResponse, 
    setIsWaitingForResponse 
  ] = useState<boolean>(false)
  const [ 
    areNoObserverResultsToView, 
    setAreNoObserverResultsToView 
  ] = useState<boolean>(false)
  const [ isNobelLaureate, setIsNobelLaureate ] = useState<boolean>(false)
  const [ participantCreated, setParticipantCreated ] = useState<boolean>(false)
  // Custom
  const [
    participants, 
    setParticipants
  ] = useState<ParticipantType[] | null>(null)
  const [
    selectedParticipant, 
    setSelectedParticipant
  ] = useState<ParticipantType | null>(null)
  const [showModal, setShowModal] = useState<ShowModalType>(null)
  const [ observerResultsToView, setObserverResultsToView ] = useState<any>({})


  // -------------------------- Regular functions ------------------------------
  // ~~~~~~ Modal handlers ~~~~~~
  function handleViewObserverResults (participant: ParticipantType) {
    setSelectedParticipant(participant)
    setShowModal('viewObserverResultsModal')
  }

  function handleOpenCreateParticipantModal(e: any) {
    setShowModal('createParticipantModal')
  }

  function handleOpenDownloadDataModal(e: any) {
    setShowModal('downloadDataModal')
  }
  
  // ~~~~~~ Input handlers ~~~~~~
  function onNameChange(e: any) {
    const { value } = e.target
    setParticipantName(value)
  }
  
  function onEmailChange(e: any) {
    const { value } = e.target
    setParticipantEmail(value)
  }
  
  function onNobelLaureateChange(e: any) {
    const { value, checked } = e.target
    setIsNobelLaureate(checked)
  }

  function onViewObserverResultsChange(e: any, id: string, name: string) {
    const { checked } = e.target

    setObserverResultsToView({
      ...observerResultsToView,
      assessment: {
        id,
        name,
      },
    })
  }

  // -------------------------- Async functions --------------------------------
  async function handleOnViewObserverResults(e: any) {
    console.log('Viewing observer results!')
  }


  async function handleOnCreateParticipant(e: any) {
    e.preventDefault()

    setIsCreatingParticipant(true)

    // 1. Create a new `participant` object
    const participant: ParticipantType = {
      name: participantName,
      email: participantEmail,
      assessmentNames: assessmentNames,
      isNobelLaureate: isNobelLaureate,
    }

    // 2. Store the new `participant` object in DynamoDB
    await storeParticipantInDynamoDB(participant)

    // 3. Stop loading spinner
    setIsCreatingParticipant(false)
    // 4. Close Modal
    setShowModal(null)
    // 5. Update state to refetch `participants` from DynamoDB
    setParticipantCreated(true)
  }


  async function getParticipants() {
    setIsWaitingForResponse(true)

    try {
      const response = await fetch('/api/admin-portal/participants', { 
        method: 'GET',
      })
      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      setParticipants(json.participants)
      setParticipantCreated(false)
      setIsWaitingForResponse(false)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  async function storeParticipantInDynamoDB(
    _participant: ParticipantType
  ) {
    const CURRENT_TIMESTAMP = new Date().getTime()

    const { email, username } = await getUsernameAndEmailFromCookie()


    if (email === undefined) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error getting email from cookie!`)
    } else {
      /**
       * @dev This is the object that we store in DynamoDB using AWS's 
       * `PutItemCommand` operation.
       */
      const participant: Omit<PARTICIPANT_DYNAMODB, "id"> = {
        adminEmail: email,
        adminUsername: username,
        name: _participant.name,
        email: _participant.email,
        assessmentNames: _participant.assessmentNames,
        isNobelLaureate: _participant.isNobelLaureate,
        timestamp: CURRENT_TIMESTAMP,
      }

      try {
        const response = await fetch('/api/admin-portal/participant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ participant }),
        })

        const json = await response.json()


        if (response.status === 200) {
          const participantId = json.participantId
          return participantId
        } else {
          setParticipantCreated(false)

          const error = `Error posting ${ 'new participant' } to DynamoDB: `
          /**
           * @todo Handle error UI here
           */
          throw new Error(error, json.error)
        }
      } catch (error: any) {
        setParticipantCreated(false)

        /**
         * @todo Handle error UI here
         */
        throw new Error(`Error! `, error)

      }
    }
  }


  // -------------------------------- Mappings ---------------------------------
  const pageNavButtons = [
    {
      buttonText: `Create Participant`,
      onClick: handleOpenCreateParticipantModal
    },
    {
      buttonText: `Download Data`,
      onClick: handleOpenDownloadDataModal
    },
  ]


  // ---------------------------------- Hooks ----------------------------------
  useClickOutside(modalRef, () => setShowModal(null))


  
  useLayoutEffect(() => {
    const requests = [
      getParticipants()
    ]

    Promise.all(requests)
  }, [participantCreated])






  return (
    <>
      <div 
        style={{ 
          ...definitelyCenteredStyle,
          flexDirection: 'column',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {/* Title */}
        <h2>{ PAGE_TITLE }</h2>

        {/* Page Nav */ }
        <div 
          style={{ 
            gap: '18px',
            display: 'flex', 
            margin: '24px 0px'
          }}
        >
          { pageNavButtons.map((btn, i: number) => (
            <Fragment key={ i }>
              <div>
                <button
                  style={{ width: '140px' }}
                  className={ styles.button }
                  onClick={ btn.onClick }
                >
                  { btn.buttonText }
                </button>
              </div>
            </Fragment>
          )) }
        </div>

        {/* Table of participants */}
        <ParticipantsTable 
          participants={ participants }
          isWaitingForResponse={ isWaitingForResponse }
          handleViewObserverResults={ handleOnViewObserverResults }
        />

        {/* Modals */}
        <CreateParticipantModal
          modalRef={ modalRef }
          onClick={ handleOnCreateParticipant }
          state={{
            isCreatingParticipant,
            isModalVisible: showModal === 'createParticipantModal' 
              ? true 
              : false ,
          }}
          onChange={{
            onNameChange,
            onEmailChange,
            onNobelLaureateChange,
          }}
        />
        
        <DownloadDataModal 
          modalRef={ modalRef }
        />

        <ObserverResultsModal 
          modalRef={ modalRef }
          selectedParticipant={ selectedParticipant }
          isModalVisible={
            showModal === 'viewObserverResultsModal' 
              ? true 
              : false
          }
          onEventHandlers={{
            onClick: handleOnViewObserverResults,
            onViewObserverResultsChange: onViewObserverResultsChange
          }}
        />

      </div>
    </>
  )
} 


export default AdminPortal
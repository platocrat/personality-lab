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
// Components
import ObserverResultsModal from '@/components/Modals/ObserverResultsModal'
import DownloadDataModal from '@/components/Modals/AdminPortal/DownloadData'
import CreateParticipantModal from '@/components/Modals/AdminPortal/CreateParticipant'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { 
  ParticipantType, 
  BessiSkillScoresType,
  getUsernameAndEmailFromCookie,
  PARTICIPANT_DYNAMODB,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type AdminPortalProps = {

}


type ShowModalType = 'createParticipantModal' | 'downloadDataModal' |
  'viewObserverResponseModal' | 'viewObserverResultsModal' | null



  const PAGE_TITLE = 'Admin Portal'

const TABLE_HEADERS = [
  `ID`,
  `Username`,
  `Email`,
  `Observer Response`,
  `Observer Results`,
]

const tdOrThStyle: CSSProperties = {
  padding: '8px',
  textAlign: 'center',
  border: '1px solid #dddddd',
}


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
    isWaitingForResponse, 
    setIsWaitingForResponse 
  ] = useState<boolean>(false)
  const [ isNobelLaureate, setIsNobelLaureate ] = useState<boolean>(false)
  const [ participantCreated, setParticipantCreated ] = useState<boolean>(false)
  // Custom
  const [
    selectedParticipant, 
    setSelectedParticipant
  ] = useState<ParticipantType | null>(null)
  const [showModal, setShowModal] = useState<ShowModalType>(null)
  const [participants, setParticipants] = useState<ParticipantType[]>([
    {
      name: '',
      isNobelLaureate: false,
      assessmentNames: [ '' ],
      email: '',
    },
  ])


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

  // -------------------------- Async functions --------------------------------
  async function handleOnViewObserverResults(e: any) {
    console.log('Viewing observer results!')
  }


  async function handleOnCreateParticipant(e: any) {
    e.preventDefault()

    setIsWaitingForResponse(true)

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
    setIsWaitingForResponse(false)
    // 4. Close Modal
    setShowModal(null)
    // 5. Update state to refetch `participants` from DynamoDB
    setParticipantCreated(true)
  }


  async function getParticipants() {
    try {
      const response = await fetch('/api/admin-portal/participants', { 
        method: 'GET',
      })
      const data = await response.json()

      if (response.status === 401) return { user: null, error: data.message }
      if (response.status === 400) return { user: null, error: data.error }

      setParticipants(data.participants)
      setParticipantCreated(false)
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

        {/* Table of students */}
        <div
          style={{
            width: '100%',
            margin: '20px 0',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              margin: '0 auto',
              borderCollapse: 'collapse',
            }}
          >
            <thead
              style={{
                backgroundColor: '#f4f4f4',
              }}
            >
              { TABLE_HEADERS.map((name: string, i: number) => (
                <Fragment key={ i }>
                  <th style={ tdOrThStyle }>
                    <p>
                      { name }
                    </p>
                  </th>
                </Fragment>
              )) }
            </thead>
            <tbody>
              { participants?.map((participant: ParticipantType, i: number) => (
                <Fragment key={ i }>
                  <tr>
                    <td style={ tdOrThStyle }>
                      <p>
                        <span>
                          <p>{ i }</p>
                        </span>
                      </p>
                    </td>
                    <td style={ tdOrThStyle }>
                      <p>
                        <span>
                          <p>{ participant.name }</p>
                        </span>
                      </p>
                    </td>
                    <td style={ tdOrThStyle }>
                      <p>
                        <span>
                          <p>{ participant.email }</p>
                        </span>
                      </p>
                    </td>
                    <td style={ tdOrThStyle }>
                      <p>
                        <span>
                          <p>{  }</p>
                        </span>
                      </p>
                    </td>
                    <td style={ tdOrThStyle }>
                      <p 
                        className={ styles.externalLink }
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={
                          (e: any) => handleViewObserverResults(
                            participant
                          )
                        }
                      >
                        <span>
                          <p>{ `View Results` }</p>
                        </span>
                      </p>
                    </td>
                  </tr>
                </Fragment>
              )) }
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <CreateParticipantModal
          modalRef={ modalRef }
          onClick={ handleOnCreateParticipant }
          state={{
            isWaitingForResponse,
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
          onClick={ handleOnViewObserverResults }
          selectedParticipant={ selectedParticipant }
          isModalVisible={
            showModal === 'viewObserverResultsModal' ? true : false
          }
        />

      </div>
    </>
  )
} 


export default AdminPortal
// Externals
import { FC, Fragment, useLayoutEffect, useRef, useState } from 'react'
// Locals
// Components
import DownloadDataModal from '@/components/Modals/AdminPortal/DownloadData'
import CreateParticipantModal from '@/components/Modals/AdminPortal/CreateParticipant'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// CSS
import styles from '@/app/page.module.css'
import { BessiSkillScoresType, getUsernameAndEmailFromCookie } from '@/utils'



type AdminPortalProps = {

}


const PAGE_TITLE = 'Admin Portal'

const TABLE_HEADERS = [
  `ID`,
  `Username`,
  `Email`,
  `Observer Response`,
  `Observer Results`,
]




const AdminPortal: FC<AdminPortalProps> = ({

}) => {
  // Refs
  const modalRef = useRef<any>(null)
  // States
  const [ participants, setParticipants ] = useState<any[]>([])
  const [ isNobelLaureate, setIsNobelLaureate ] = useState<string>('')
  const [ assessmentName, setAssessmentName ] = useState<string>('')
  const [ participantName, setParticipantName ] = useState<string>('')
  const [ participantEmail, setParticipantEmail ] = useState<string>('')
  const [ participantCreated, setParticipantCreated ] = useState(false)
  const [ showModal, setShowModal ] = useState<'modal1' | 'modal2' | null>(null)


  // -------------------------- Regular functions ------------------------------
  function handleOpenCreateParticipantModal(e: any) {
    setShowModal('modal1')
  }

  function handleOpenDownloadDataModal(e: any) {
    setShowModal('modal2')
  }
  
  function onNameChange(e: any) {
    const { value } = e.target
    setParticipantName(value)
  }
  
  function onEmailChange(e: any) {
    const { value } = e.target
    setParticipantEmail(value)
  }
  
  function onNobelLaureateChange(e: any) {
    const { value } = e.target
    setIsNobelLaureate(value)
  }

  // -------------------------- Async functions --------------------------------
  async function handleOnCreateParticipant(e: any) {
    e.preventDefault()

    // 1. Create a new `participant` object
    const participant = {
      name: participantName,
      email: participantEmail,
      assessmentName: assessmentName,
      isNobelLaureate: isNobelLaureate,
    }

    // 2. Store the new `participant` object in DynamoDB
    await storeParticipantInDynamoDB(participant)

    // 3. Update state to refetch `participants` from DynamoDB
    setParticipantCreated(true)
  }


  async function getParticipants() {
    try {
      const response = await fetch('/api/admin-portal/participants', { 
        method: 'GET' 
      })
      const data = await response.json()

      if (response.status === 401) return { user: null, error: data.message }
      if (response.status === 400) return { user: null, error: data.error }
      // Assumes `response.status === 200 && data.message === 'User authenticated'`
      return { user: data.participant, error: null }
    } catch (error: any) {
      return { user: null, error: error }
    }
  }


  async function storeParticipantInDynamoDB(
    _participant
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
      const participant = {
        adminEmail: email,
        adminUsername: username,
        name: _participant.name,
        email: _participant.Email,
        assessmentName: _participant.assessmentName,
        isNobelLaureate: _participant.isNobelLaureate,
        timestamp: CURRENT_TIMESTAMP,
      }

      try {
        const response = await fetch('/api/assessment/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _participant
          }),
        })

        const json = await response.json()

        if (response.status === 200) {
          const userResultsId = json.data
          return userResultsId
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
      <div>

        {/* Title */}
        <h2>{ PAGE_TITLE }</h2>

        {/* Page Nav */ }
        <div>
          { pageNavButtons.map((btn, i: number) => (
            <Fragment key={ i }>
              <div>
                <button
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
        <div>
          <table>
            <thead>
              { TABLE_HEADERS.map((name: string, i: number) => (
                <Fragment key={ i }>
                  <div>
                    <p>
                      { name }
                    </p>
                  </div>
                </Fragment>
              )) }
            </thead>
            <tr>
              { participants }
            </tr>
          </table>
        </div>

        {/* Create Participant Modal */}
        <CreateParticipantModal 
          onClick={ handleOnCreateParticipant }
          onChange={{
            onNameChange,
            onEmailChange,
            onNobelLaureateChange,
          }}
        />
        
        {/* Create Participant Modal */}
        <DownloadDataModal 

        />

      </div>
    </>
  )
} 


export default AdminPortal
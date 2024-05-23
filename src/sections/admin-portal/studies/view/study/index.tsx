'use client'

import {
  FC, 
  Fragment, 
  useLayoutEffect, 
  useRef, 
  useState,
} from 'react'
// Locals
import ParticipantsTable from './participants-table'
// Components
import ViewResultsModal from '@/components/Modals/ViewResultsModal'
import DownloadDataModal from '@/components/Modals/AdminPortal/DownloadData'
import CreateParticipantModal from '@/components/Modals/AdminPortal/CreateParticipant'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { 
  ParticipantType, 
  PARTICIPANT__DYNAMODB,
  getUsernameAndEmailFromCookie,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'




type ViewStudyProps = {

}





const ViewStudy: FC<ViewStudyProps> = ({

}) => {
  // Refs
  const viewResultsModalRef = useRef<any>(null)
  const downloadDataModalRef = useRef<any>(null)
  const createParticipantModalRef = useRef<any>(null)
  // States
  // Strings
  const [studyNames, setStudyNames] = useState<string[]>([''])
  const [participantEmail, setParticipantEmail] = useState<string>('')
  const [participantUsername, setParticipantUsername] = useState<string>('')
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
    noResultsToView,
    setNoResultsToView
  ] = useState<boolean>(false)
  const [
    showViewResultsModal,
    setShowViewResultsModal
  ] = useState<boolean>(false)
  const [
    showDownloadDataModal,
    setShowDownloadDataModal
  ] = useState<boolean>(false)
  const [
    showCreateParticipantModal,
    setShowCreateParticipantModal
  ] = useState<boolean>(false)
  const [isNobelLaureate, setIsNobelLaureate] = useState<boolean>(false)
  const [participantCreated, setParticipantCreated] = useState<boolean>(false)
  // Custom
  const [
    participants,
    setParticipants
  ] = useState<ParticipantType[] | null>(null)
  const [
    selectedParticipant,
    setSelectedParticipant
  ] = useState<ParticipantType | null>(null)
  const [resultsToView, setResultsToView] = useState<any>({})


  // -------------------------- Regular functions ------------------------------
  // ~~~~~~ Modal handlers ~~~~~~
  function handleViewObserverResults(participant: ParticipantType) {
    setSelectedParticipant(participant)
    setShowViewResultsModal(true)
  }

  function handleOpenCreateParticipantModal(e: any) {
    setShowCreateParticipantModal(true)
  }

  function handleOpenDownloadDataModal(e: any) {
    setShowDownloadDataModal(true)
  }

  // ~~~~~~ Input handlers ~~~~~~
  function onUsernameChange(e: any) {
    const { value } = e.target
    setParticipantUsername(value)
  }

  function onEmailChange(e: any) {
    const { value } = e.target
    setParticipantEmail(value)
  }

  function onNobelLaureateChange(e: any) {
    const { value, checked } = e.target
    setIsNobelLaureate(checked)
  }

  function onViewResultsChange(e: any, id: string, name: string) {
    const { checked } = e.target

    setResultsToView({
      ...resultsToView,
      assessment: {
        id,
        name,
      },
    })
  }

  // -------------------------- Async functions --------------------------------
  async function handleOnViewResults(e: any) {
    console.log('Viewing results!')
  }


  async function handleOnCreateParticipant(e: any) {
    e.preventDefault()

    setIsCreatingParticipant(true)

    // 1. Create a new `participant` object
    const participant: ParticipantType = {
      email: participantEmail,
      username: participantUsername,
      studyNames: studyNames,
      isNobelLaureate: isNobelLaureate,
    }

    // 2. Store the new `participant` object in DynamoDB
    await storeParticipantInDynamoDB(participant)

    // 3. Stop loading spinner
    setIsCreatingParticipant(false)
    // 4. Close Modal
    setShowCreateParticipantModal(false)
    // 5. Update state to refetch `participants` from DynamoDB
    setParticipantCreated(true)
  }


  async function getParticipants() {
    setIsWaitingForResponse(true)

    try {
      const response = await fetch('/api/study/participants', {
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
      const participant: Omit<PARTICIPANT__DYNAMODB, "id"> = {
        adminEmail: email,
        adminUsername: username,
        email: _participant.email,
        username: _participant.username,
        studyNames: _participant.studyNames,
        isNobelLaureate: _participant.isNobelLaureate,
        timestamp: CURRENT_TIMESTAMP,
      }

      try {
        const response = await fetch('/api/study/participant', {
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

          const error = `Error posting ${'new participant'} to DynamoDB: `
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
  useClickOutside(
    createParticipantModalRef,
    () => setShowCreateParticipantModal(false)
  )
  useClickOutside(
    downloadDataModalRef,
    () => setShowDownloadDataModal(false)
  )
  useClickOutside(
    viewResultsModalRef,
    () => setShowViewResultsModal(false)
  )



  useLayoutEffect(() => {
    const requests = [
      getParticipants()
    ]

    Promise.all(requests)
  }, [participantCreated])




  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column',
          width: '100%',
          maxWidth: '800px',
        } }
      >
        {/* Page Nav */ }
        <div
          style={ {
            gap: '18px',
            display: 'flex',
            margin: '24px 0px'
          } }
        >
          { pageNavButtons.map((btn, i: number) => (
            <Fragment key={ i }>
              <div>
                <button
                  style={ { width: '140px' } }
                  className={ styles.button }
                  onClick={ btn.onClick }
                >
                  { btn.buttonText }
                </button>
              </div>
            </Fragment>
          )) }
        </div>

        {/* Table of participants */ }
        <ParticipantsTable
          participants={ participants }
          isWaitingForResponse={ isWaitingForResponse }
          handleViewObserverResults={ handleViewObserverResults }
        />

        {/* Modals */ }
        <CreateParticipantModal
          onClick={ handleOnCreateParticipant }
          modalRef={ createParticipantModalRef }
          state={ {
            isCreatingParticipant,
            isModalVisible: showCreateParticipantModal,
          } }
          onChange={ {
            onEmailChange,
            onUsernameChange,
            onNobelLaureateChange,
          } }
        />

        <DownloadDataModal
          modalRef={ downloadDataModalRef }
        />

        <ViewResultsModal
          modalRef={ viewResultsModalRef }
          isModalVisible={ showViewResultsModal }
          selectedParticipant={ selectedParticipant }
          onEventHandlers={ {
            handleOnViewResults,
            onViewResultsChange
          } }
        />
      </div>
    </>
  )
}


export default ViewStudy
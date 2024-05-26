'use client'

import {
  FC, 
  useRef, 
  Fragment,
  useState,
  useLayoutEffect, 
} from 'react'
import { usePathname } from 'next/navigation'
// Locals
import ParticipantsTable from './participants-table'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
import Spinner from '@/components/Suspense/Spinner'
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




type ViewStudySectionProps = {
  studyName: string | undefined
  studyDescription: string | undefined
}





const ViewStudySection: FC<ViewStudySectionProps> = ({
  studyName,
  studyDescription,
}) => {
  // Hooks
  const pathname = usePathname()
  // Refs
  const viewResultsModalRef = useRef<any>(null)
  const downloadDataModalRef = useRef<any>(null)
  const createParticipantModalRef = useRef<any>(null)
  // States
  // Strings
  const [studyId, setStudyId] = useState<string>('')
  const [inviteUrl, setInviteUrl] = useState<string>('')
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
      studyNames: [ studyName ?? '' ],
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


  /**
   * @dev Makes a `GET` request to get the `study` from the given ID to index
   *      the `participants` property from the `study` object
   */
  async function getParticipants() {
    if (studyId !== '') {
      setIsWaitingForResponse(true)

      try {
        const response = await fetch(`/api/study?id=${ studyId }`, {
          method: 'GET',
        })
        
        const json = await response.json()

        if (response.status === 500) throw new Error(json.error)
        if (response.status === 405) throw new Error(json.error)

        const participants_ = json.study.participants

        setParticipants(participants_)
        setParticipantCreated(false)
        setIsWaitingForResponse(false)
      } catch (error: any) {
        setIsWaitingForResponse(false)
        throw new Error(error.message)
      }
    }
  }


  async function getStudyIdAndInviteUrl() {
    const studyId_ = pathname.slice(
      pathname.indexOf('/study/') + '/study/'.length
    )
    const inviteUrl_ = `${ window.location.origin }/invite/${studyId_}`

    setStudyId(studyId_)
    setInviteUrl(inviteUrl_)
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
        studies: [
          { 
            _participant.studyNames 
          }
        ],
        isNobelLaureate: _participant.isNobelLaureate,
        timestamp: CURRENT_TIMESTAMP,
      }

      try {
        const response = await fetch('/api/study/participant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ participant, studyId }),
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
      getStudyIdAndInviteUrl(),
      getParticipants(),
    ]

    Promise.all(requests)
  }, [ studyId, participantCreated ])




  return (
    <>
      <LeftHandNav>
        <div 
          style={ { 
            ...definitelyCenteredStyle, 
            flexDirection: 'column' 
          }}
        >
          { isWaitingForResponse ? (
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
                style={ {
                  ...definitelyCenteredStyle,
                  flexDirection: 'column'
                } }
              >
                {/* Study Name */}
                <h3 style={ { marginBottom: '4px' } }>
                  { `${ studyName }` }
                </h3>
                {/* Study ID */}
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                    fontSize: '12px',
                    color: 'gray',
                  } }
                >
                  <p style={ { marginRight: '8px' } }>
                    { `ID: ` }
                  </p>
                  <p>
                    { studyId }
                  </p>
                </div>
                {/* Study ID */}
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                    fontSize: '13px',
                  } }
                >
                  <p style={ { marginRight: '8px' } }>
                    { `Invite Link: ` }
                  </p>
                  <input
                    readOnly
                    type='text'
                    value={ inviteUrl }
                    style={{ fontSize: '13px' }}
                    onClick={ (e) => {
                      e.preventDefault()
                      e.currentTarget.select()
                    } }
                  />
                </div>
                {/* Study Description */}
                <div
                  style={ {
                    fontSize: '13px',
                    textAlign: 'left',
                    margin: '12px 24px 0px 48px',
                  } }
                >
                  <p>{ studyDescription }</p>
                </div>
              </div>

              <div
                style={ {
                  ...definitelyCenteredStyle,
                  width: '100%',
                  fontSize: '13px',
                  flexDirection: 'column',
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
                          onClick={ btn.onClick }
                          style={{ width: '140px' }}
                          className={ styles.button }
                        >
                          { btn.buttonText }
                        </button>
                      </div>
                    </Fragment>
                  )) }
                </div>

                { participants && participants.length > 0 && (
                  <>
                    {/* Table of participants */ }
                    <ParticipantsTable
                      participants={ participants }
                      handleViewObserverResults={ handleViewObserverResults }
                    />
                  </>
                )}

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
                    onViewResultsChange,
                  } }
                />
              </div>
            </>
          )}
        </div>
      </LeftHandNav>
    </>
  )
}


export default ViewStudySection
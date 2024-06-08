'use client'

import Image from 'next/image'
import {
  FC,
  useMemo,
  useState,
  Fragment,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import StudyHeader from './header'
import ParticipantsTable from './participants-table'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context types
import { SessionContextType } from '@/contexts/types'
// Hooks
// Utils
import {
  STUDY__DYNAMODB,
  RESULTS__DYNAMODB,
  PARTICIPANT__DYNAMODB,
  AVAILABLE_ASSESSMENTS,
  BessiUserResults__DynamoDB,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import pageStyles from '@/sections/main-portal/studies/view/study/ViewStudy.module.css'
import viewStudiesStyles from '@/sections/main-portal/studies/view/ViewStudies.module.css'




type ViewStudySectionProps = {
  study?: STUDY__DYNAMODB
}





const ViewStudySection: FC<ViewStudySectionProps> = ({
  study
}) => {
  // Contexts
  const { 
    email,
  } = useContext<SessionContextType>(SessionContext)
  // States
  // Strings
  const [inviteUrl, setInviteUrl] = useState<string>('')
  const [participantEmail, setParticipantEmail] = useState<string>('')
  // Booleans
  const [
    isWaitingForResponse,
    setIsWaitingForResponse
  ] = useState<boolean>(false)
  const [
    noResultsToView,
    setNoResultsToView
  ] = useState<boolean>(false)
  const [ isCopied, setIsCopied ] = useState(false)
  const [ participantCreated, setParticipantCreated ] = useState<boolean>(false)
  // Custom
  const [
    participants,
    setParticipants
  ] = useState<PARTICIPANT__DYNAMODB[] | null>(null)
  const [ results, setResults ] = useState<RESULTS__DYNAMODB[] | null>(null)



  // ------------------------- Memoized constants ------------------------------
  const showPageNav = useMemo((): boolean => {
    return results !== null
  }, [ participants ])

  // -------------------------- Async functions functions ------------------------------
  // ~~~~~~ Button handlers ~~~~~~
  function handleCopyInviteLink ()  {
    navigator.clipboard.writeText(inviteUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // ~~~~~~ Input handlers ~~~~~~
  function onEmailChange(e: any) {
    const { value } = e.target
    setParticipantEmail(value)
  }

  // -------------------------- Async functions --------------------------------
  /**
   * @dev Makes a `GET` request to get the `study` from the given ID to index
   *      the `participants` property from the `study` object
   */
  async function getParticipants() {
    try {
      const response = await fetch(`/api/study?id=${study?.id}`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      const study_ = json.study as STUDY__DYNAMODB
      const results_ = study_.results as RESULTS__DYNAMODB[] ?? null
      const participants_ = study_.participants as PARTICIPANT__DYNAMODB[] ?? null

      setResults(results_)
      setParticipants(participants_)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // Utility function to convert JSON to CSV
  async function getCsvData(
    participants: PARTICIPANT__DYNAMODB[],
    results: RESULTS__DYNAMODB[],
  ) {
    const studyAssessmentName = AVAILABLE_ASSESSMENTS.find(
      (availableAssessment: { id: string, name: string }): boolean =>
        availableAssessment.id === participants[0]?.studies[0]?.assessmentId
    )?.name

    /**
     * @todo Convert this to a switch-function to handle all assessment names
     */
    if (studyAssessmentName === 'BESSI') {
      const results_ = results.map(
        (result: RESULTS__DYNAMODB) => result.results
      )

      
      console.log(`results_: `, results_)


      if (results_.length === 0) return ''

      // Flatten the structure for CSV
      const headers = [
        'participantId',
        ...Object.keys(results_[0].facetScores),
        ...Object.keys(results_[0].domainScores),
        ...Object.keys(results_[0].demographics)
      ]

      const rows = results_.map((
        result: BessiUserResults__DynamoDB, 
        i: number
      ): (string| number)[] => {
        const { facetScores, domainScores, demographics } = result

        return [
          participants[i].id,
          ...Object.values(facetScores),
          ...Object.values(domainScores),
          ...Object.values(demographics)
        ]
      })

      const csvData = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      return csvData
    }

    return ''
  }


  async function getStudyIdAndInviteUrl() {
    let inviteUrl_

    if (window !== undefined) {
      inviteUrl_ = `${window.location.origin}/invite/${study?.id}`
    }

    setInviteUrl(inviteUrl_)
  }


  // ~~~~~~ Button handlers ~~~~~~
  async function handleDownloadData(e: any) {
    if (!participants && !results) return

    // Show confirmation alert
    const alertMessage = 'Download participant data as a CSV file?'

    let shouldDownload 
    
    if (window !== undefined) {
      shouldDownload = window.confirm(alertMessage)
    }

    if (!shouldDownload) return

    // Convert participants data to CSV
    const csvData = await getCsvData(
      participants as PARTICIPANT__DYNAMODB[],
      results as RESULTS__DYNAMODB[],
    )

    // Create a blob from the CSV content
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'participants.csv')

    // Append the link to the body
    document.body.appendChild(link)

    // Simulate a click
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }



  // -------------------------------- Mappings ---------------------------------
  const pageNavButtons = [
    {
      buttonText: (
        <div style={{ ...definitelyCenteredStyle, gap: '4px' }}>
          <Image
            width={ 20 }
            height={ 20 }
            alt={ 'Download file icon' }
            src={ '/icons/svg/download-file.svg' }
          />
          <p style={{ fontSize: '14px' }}>{ `.csv` }</p>
        </div>
      ),
      onClick: handleDownloadData
    },
  ]

  // -------------------------- `useLayoutEffect`s -----------------------------
  useLayoutEffect(() => {
    if (
      study &&
      (study?.id !== '' || study?.id !== undefined)
    ) {
      setIsWaitingForResponse(true)

      const requests = [
        getStudyIdAndInviteUrl(),
        getParticipants(),
      ]

      Promise.all(requests).then((response: any) => {
        setIsWaitingForResponse(false)
      })
    }
  }, [ study?.id, participantCreated ])




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
              <StudyHeader 
                study={ study }
                isCopied={ isCopied }
                handleCopyInviteLink={ handleCopyInviteLink }
              />

              <div
                style={ {
                  ...definitelyCenteredStyle,
                  position: 'relative',
                  width: '100%',
                  fontSize: '13px',
                  flexDirection: 'column',
                } }
              >
                {/* Page Nav */ }
                { showPageNav && (
                  <div className={ pageStyles.pageNav }>
                    { pageNavButtons.map((btn, i: number) => (
                      <Fragment key={ i }>
                        <div>
                          <button
                            type={ 'button' }
                            onClick={ btn.onClick }
                          >
                            { btn.buttonText }
                          </button>
                        </div>
                      </Fragment>
                    )) }
                  </div>
                )}

                { participants !== null && participants.length > 0 ? (
                  <div 
                    className={ `${viewStudiesStyles['form-container']}` }
                    style={{ 
                      marginTop: participants[0].studies[0].results ? '36px' : ''
                    }}
                  >
                    <ParticipantsTable participants={ participants } />
                  </div>
                ) : (
                  <div style={{ margin: '72px 0px' }}>
                    <h3>{ `Invite participants to register to your study!` }</h3>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </LeftHandNav>
    </>
  )
}


export default ViewStudySection
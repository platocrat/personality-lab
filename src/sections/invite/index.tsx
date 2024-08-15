// Externals
import { 
  FC,
  useState,
  CSSProperties,
} from 'react'
import { useRouter } from 'next/navigation'
// Locals
import { 
  STUDY__DYNAMODB,
  PARTICIPANT__DYNAMODB, 
  AVAILABLE_ASSESSMENTS, 
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import InviteRegistrationForm from './registration-form'
import sectionStyles from '@/sections/invite/StudyInviteSection.module.css'



type StudyInviteSectionProps = {
  study: STUDY__DYNAMODB | null
}



const pStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between'
}




const StudyInviteSection: FC<StudyInviteSectionProps> = ({ study }) => {
  // Hooks
  const router = useRouter()
  // States
  const [ 
    participantRegistered, 
    setParticipantRegistered
  ] = useState<boolean>(false)
  const [ 
    isDuplicateRegistration, 
    setIsDuplicateRegistration
  ] = useState<boolean>(false)
  const [
    redirectingToSigUpPage,
    setRedirectingToSignUpPage
  ] = useState<boolean>(false)
  const [ 
    isParticipantRegistering, 
    setIsParticipantRegistering
  ] = useState<boolean>(false)
  const [
    isDuplicateRegistrationMessage, 
    setIsDuplicateRegistrationMessage 
  ] = useState<string>('')
  const [ participantId, setParticipantId ] = useState<string>('')
  const [ participantEmail, setParticipantEmail ] = useState<string>('')


  const studyAssessmentName = AVAILABLE_ASSESSMENTS.find((
    availableAssessment: { id: string, name: string }
  ): boolean => availableAssessment.id === study?.details.assessmentId
  )?.name


  // ---------------------------- Async functions ------------------------------
  async function handleOnRegisterForAssessment (
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    // 1. Start loading spinner
    setIsParticipantRegistering(true)

    // 2. Construct new `participant` to store in DynamoDB
    const participant: Omit<PARTICIPANT__DYNAMODB, "id"> = {
      email: participantEmail,
      timestamp: 0,
      /**
       * @dev Update `studies` with pre-existing `studies` when updating
       *      the user's account entry in the `/api/study/participant` API 
       *      endpoint, i.e. when fetching the user's account entry from the 
       *      `account` table, use the account entry's 
       *      `account.participant.studies` property to update `studies`
       *      for the participant.
       */
      studies: [
        {
          id: study ? study.id : '',
          name: study ? study.name : '',
          ownerEmail: study ? study.ownerEmail : '',
          adminEmails: study ? study.adminEmails : [''],
          assessmentId: study ? study.details.assessmentId : '',
          updatedAtTimestamp: study ? study.updatedAtTimestamp : 0,
          createdAtTimestamp: study ? study.createdAtTimestamp : 0,
        }
      ],
    }
    
    // // 3. `Put` and/or `Update` the new `participant` object in the appropriate
    // //     DynamoDB tables.
    // await storeParticipantInDynamoDB(participant)
  }


  async function storeParticipantInDynamoDB(
    participant: Omit<PARTICIPANT__DYNAMODB, "id">
  ) {
    try {
      // Send a request to add the `participant` to the `study` entry and to
      // create or update the `account` entry with this `participant`. 
      const response = await fetch('/api/study/participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        /**
         * @dev Pass the `studyId` to update the study entry the appropriate 
         *      study entry with the new `participant`.
         */
        body: JSON.stringify({ 
          participant, 
          studyId: study?.id
        }),
      })

      const json = await response.json()


      if (response.status === 200) {
        const participantId_ = json.participantId
        
        setParticipantRegistered(true)
        // 4. Stop loading spinner
        setIsParticipantRegistering(false)
        // 5. Show notification message informing the participant that they are
        //    now being redirected to the sign-up page.
        setParticipantId(participantId_)
        setRedirectingToSignUpPage(true)
        // 6. Redirect the participant to the home page to login or create an 
        // account. The client will authenticate and display which assessments
        // the participant may complete
        setTimeout(() => {
          router.push('/')
        }, 2_500)
      } else if (response.status === 400) {
        setParticipantRegistered(false)
        setIsDuplicateRegistration(true)
        setIsDuplicateRegistrationMessage(json.message)
      } else {
        // Handle error response from the backend
        setParticipantRegistered(false)

        const error = `Error posting ${'new participant'} to DynamoDB: `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      setParticipantRegistered(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error registering participant:  `, error)
    }
  }





  return (
    <>
      <div 
        style={{ marginTop: '24px' }}
        className={ sectionStyles['form-container'] }
      >
        <div style={{ ...definitelyCenteredStyle, marginBottom: '36px' }}>
          <h3
            style={{ 
              color: isDuplicateRegistration ? 'red' : '',
            }}
          >
            { participantRegistered
              ? `Thank you for registering for ${study?.name}!`
              : isDuplicateRegistration 
                ? isDuplicateRegistrationMessage 
                : `You've been invited to the following study`
            }
          </h3>
        </div>

        { participantRegistered ? ( 
          <>
            <div 
              style={{ 
                ...definitelyCenteredStyle,
                flexDirection: 'column',
              }}
            >
              <p>{ `You are being redirected to the sign-up page...` }</p>
              <p>{` Your participant ID is ${participantId}`}</p>
            </div>
          </>
         ) : (
          <>
            <div>
              <p style={ pStyle }>
                <span>{ `Study Name:` }</span>
                { study?.name }
              </p>
              <p style={ pStyle }>
                <span>{ `Description:` }</span>
                { study?.details.description }
              </p>
              <p
                style={ pStyle }
                className={ sectionStyles.last }
              >
                <span>{ `Assessment ID:` }</span>
                { studyAssessmentName }
              </p>
            </div>

            { !isDuplicateRegistration && (
              <>
                <div style={ { marginBottom: '48px' } } />

                <InviteRegistrationForm 
                  onSubmit={ handleOnRegisterForAssessment }
                  state={{
                    participantEmail,
                    setParticipantEmail,
                    isParticipantRegistering,
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default StudyInviteSection
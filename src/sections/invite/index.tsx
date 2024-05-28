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
import sectionStyles from '@/sections/invite/StudyInviteSection.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



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
    isParticipantRegistering, 
    setIsParticipantRegistering
  ] = useState<boolean>(false)
  const [
    isDuplicateRegistrationMessage, 
    setIsDuplicateRegistrationMessage 
  ] = useState<string>('')
  const [participantEmail, setParticipantEmail] = useState('')
  const [participantUsername, setParticipantUsername] = useState('')


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
      username: participantUsername,
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
          name: study ? study.name : '',
          assessmentId: study ? study.details.assessmentId : '',
        }
      ],
      adminEmail: study ? study.ownerEmail : '',
      adminUsername: '',
      isNobelLaureate: false,
      timestamp: 0,
    }
    
    // 3. `Put` and/or `Update` the new `participant` object in the appropriate
    //     DynamoDB tables.
    await storeParticipantInDynamoDB(participant)
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

      console.log(`response: `, response)
      // console.log(`json: `, json)


      if (response.status === 200) {
        const participantId = json.participantId
        
        setParticipantRegistered(true)
        // 4. Stop loading spinner
        setIsParticipantRegistering(false)
        // 5. Redirect the participant to the home page to login or create an 
        // account. The client will authenticate and display which assessments
        // the participant may complete
        router.push('/')

        return participantId
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
        <h3 style={{ ...definitelyCenteredStyle, marginBottom: '36px' }}>
          { `You've been invited to the following study` }
        </h3>

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

        <div style={{ marginBottom: '48px' }}/>

        { isDuplicateRegistration ? (
          <>
            <div style={ definitelyCenteredStyle }>
              <h4 style={{ color: 'red' }}>
                { isDuplicateRegistrationMessage }
              </h4>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={ handleOnRegisterForAssessment }>
              <label>
                { `Enter your username and email to register as a participant:` }
                <input
                  required
                  type='email'
                  value={ participantEmail }
                  className={ sectionStyles.first }
                  placeholder={ 'janedoe@gmail.com' }
                  onChange={ (e) => setParticipantEmail(e.target.value) }
                />
              </label>
              <label>
                <input
                  required
                  type="text"
                  placeholder={ 'janedoe' }
                  value={ participantUsername }
                  className={ sectionStyles.last }
                  onChange={ (e) => setParticipantUsername(e.target.value) }
                />
              </label>
              <button type='submit'>
                { `Register and Take Assessment` }
              </button>
            </form>
          </>
        ) }
        
        { participantRegistered && <p>{ `Redirecting...` }</p> }
      </div>
    </>
  )
}

export default StudyInviteSection
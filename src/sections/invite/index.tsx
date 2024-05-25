// Externals
import { 
  FC,
  useState,
  CSSProperties,
} from 'react'
// Locals
import { PARTICIPANT__DYNAMODB, STUDY__DYNAMODB } from '@/utils'
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
  const [redirectUrl, setRedirectUrl] = useState('')
  const [participantEmail, setParticipantEmail] = useState('')
  const [participantUsername, setParticipantUsername] = useState('')


  // ---------------------------- Async functions ------------------------------
  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const participant: Omit<PARTICIPANT__DYNAMODB, "id"> = {
      email: participantEmail,
      username: participantUsername,
      /**
       * @todo Merge pre-existing `studyNames` if the user is already a 
       *      participant in other studies.
       */
      studyNames: [ study ? study.name : '' ],
      adminEmail: study ? study.ownerEmail : '',
      adminUsername: '',
      isNobelLaureate: false,
      timestamp: Date.now(),
    }
    
    await handleFormSubmit(
      participant,
      study ? study.id : ''
    )
  }


  async function handleFormSubmit(
    participant,
    studyId: string,
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
         * @todo Pass the `studyId` to update the study entry the appropriate 
         *       study entry with the new `participant`.
         */
        body: JSON.stringify({ participant, studyId }),
      })

      /**
       * @todo Finish the logic to redirect the user to appropriate assessment
       *       page
       */
      if (response.ok) {
        // Assume the backend returns a URL to redirect the user to
        const { redirectUrl } = await response.json()
        window.location.href = redirectUrl
      } else {
        // Handle error response from the backend
        console.error('Failed to register participant')
      }
    } catch (error) {
      console.error('Error registering participant:', error)
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
          <p style={ pStyle }>
            <span>{ `Assessment ID:` }</span>
            { study?.details.assessmentId }
          </p>
          <p 
            className={ sectionStyles.last } 
            style={ pStyle }
          >
            <span>{ `Allowed Submissions per Participant:` }</span>
            { study?.details.allowedSubmissionsPerParticipant }
          </p>
        </div>

        <div style={{ marginBottom: '48px' }}/>

        <form onSubmit={ handleSubmit }>
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
        
        { redirectUrl && <p>{ `Redirecting...` }</p> }
      </div>
    </>
  )
}

export default StudyInviteSection
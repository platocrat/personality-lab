// Externals
import { FC, useState } from 'react'
// Locals
import { STUDY__DYNAMODB } from '@/utils'


type StudyInviteSectionProps = {
  study: STUDY__DYNAMODB | null
}



const StudyInviteSection: FC<StudyInviteSectionProps> = ({ study }) => {
  const [redirectUrl, setRedirectUrl] = useState('')
  const [participantEmail, setParticipantEmail] = useState('')


  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    await handleFormSubmit(
      participantEmail, 
      study ? study.id : ''
    )
  }


  async function handleFormSubmit (email: string, studyId: string) {
    try {
      // Send a request to your backend to register the participant
      const response = await fetch('/api/study/participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, studyId }),
      })

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
      <div>
        <p>
          {`Study Name: ${ study?.name }`}
        </p>
        <p>
          {`Description: ${ study?.details.description }`}
        </p>
        <p>
          {`Assessment ID: ${ study?.details.assessmentId }`}
        </p>
        <p>
          {`Allowed Submissions per Participant: ${ study?.details.allowedSubmissionsPerParticipant }`}
        </p>
      </div>

      <form onSubmit={ handleSubmit }>
        <label>
          { `Enter your email to register as a participant:` }
          <input
            type="email"
            value={ participantEmail }
            onChange={ (e) => setParticipantEmail(e.target.value) }
            required
          />
        </label>
        <button type="submit">
          { `Register and Take Assessment` }
        </button>
      </form>
      
      { redirectUrl && <p>{ `Redirecting...` }</p> }
    </>
  )
}

export default StudyInviteSection
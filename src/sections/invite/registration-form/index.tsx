// Externals
import { Dispatch, FC, SetStateAction } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/invite/StudyInviteSection.module.css'



type InviteRegistrationFormProps = {
  onSubmit: (e: any) => void
  state: {
    participantEmail: string
    isParticipantRegistering: boolean
    setParticipantEmail: Dispatch<SetStateAction<string>>
  }
}


const InviteRegistrationForm: FC<InviteRegistrationFormProps> = ({
  state,
  onSubmit,
}) => {
  const inputLabelText = `Enter your email to register as a participant:`
  const placeholder = 'janedoe@gmail.com'
  const inputType = 'email'

  const buttonText = `Register`
  const buttonType = 'submit'


  return (
    <>
      <form onSubmit={ onSubmit }>
        <label>
          { inputLabelText }
          <input
            required
            type={ inputType }
            placeholder={ placeholder }
            value={ state.participantEmail }
            className={ sectionStyles.first }
            onChange={ (e) => state.setParticipantEmail(e.target.value) }
          />
        </label>

        { state.isParticipantRegistering ? (
          <>
            <div
              style={ {
                ...definitelyCenteredStyle,
                position: 'relative',
                marginTop: '24px'
              } }
            >
              <Spinner height='36' width='36' />
            </div>
          </>
        ) : (
          <>
            <button type={ buttonType }>
              { buttonText }
            </button>
          </>
        )}
      </form>
    </>
  )
}

export default InviteRegistrationForm
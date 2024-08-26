// Externals
import { FC, Fragment } from 'react'
// Locals
import { PARTICIPANT__DYNAMODB } from '@/utils'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Styles
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'



type ParticipantsTableBodyProps = {
  state: {
    participants: PARTICIPANT__DYNAMODB[] | null,
    handleDeleteParticipant: (
      participantId: string,
      participantEmail: string,
    ) => void
  }
}



const ParticipantsTableBody: FC<ParticipantsTableBodyProps> = ({
  state
}) => {
  // Hooks
  const windowWidth = useWindowWidth()
  // Constants
  const isFullWidthTd = windowWidth <= 920 ? '100%' : ''
  const buttonText = `Delete`


  return (
    <>
      <tbody>
        { state.participants?.map((
          participant: PARTICIPANT__DYNAMODB, i: number
        ) => (
          <Fragment key={ i }>
            <tr>
              <td style={ { width: isFullWidthTd } }>
                <p>{ i }</p>
              </td>
              <td style={ { width: isFullWidthTd } }>
                <p>{ participant.email }</p>
              </td>
              <td style={ { width: 'auto', textAlign: 'right' } }>
                <div className={ sectionStyles.buttonContainer }>
                  <div className={ sectionStyles.buttonDiv }>
                    <button
                      type='button'
                      onClick={ 
                        (e: any): void => state.handleDeleteParticipant(
                          participant.id,
                          participant.email,
                        )
                      }
                    >
                      { buttonText }
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </Fragment>
        )) }
      </tbody>
    </>
  )
}

export default ParticipantsTableBody
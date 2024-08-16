// Externals
import { FC, Fragment } from 'react'
// Locals
import { PARTICIPANT__DYNAMODB } from '@/utils'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Styles
import { definitelyCenteredStyle } from '@/theme/styles'



type ParticipantsTableBodyProps = {
  state: {
    participants: PARTICIPANT__DYNAMODB[] | null,
    handleDeleteParticipant: (participantId: string) => void
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
                <button 
                  onClick={ 
                    (e: any): void => state.handleDeleteParticipant(
                      participant.id
                    )
                  }
                >
                  { buttonText }
                </button>
              </td>
            </tr>
          </Fragment>
        )) }
      </tbody>
    </>
  )
}

export default ParticipantsTableBody
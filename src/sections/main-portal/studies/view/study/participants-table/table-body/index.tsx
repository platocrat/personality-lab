// Externals
import { FC, Fragment } from 'react'
// Locals
import { ParticipantType } from '@/utils'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Styles
import styles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type ParticipantsTableBodyProps = {
  participants: ParticipantType[] | null
  handleViewObserverResults: (e: any) => void
}



const ParticipantsTableBody: FC<ParticipantsTableBodyProps> = ({
  participants,
  handleViewObserverResults
}) => {
  // Hooks
  const windowWidth = useWindowWidth()

  const isFullWidthTd = windowWidth <= 920 ? '100%' : ''



  return (
    <>
      <tbody>
        { participants?.map((participant: ParticipantType, i: number) => (
          <Fragment key={ i }>
            <tr>
              <td style={{ width: isFullWidthTd }}>
                <p>{ i }</p>
              </td>
              <td style={{ width: isFullWidthTd }}>
                <p>{ participant.username }</p>
              </td>
              <td style={{ width: isFullWidthTd }}>
                <p>{ participant.email }</p>
              </td>
              <td
                style={ {
                  width: windowWidth <= 920 ? '100%' : '80px',
                  position: 'relative',
                } }
              >
                <div className={ styles.buttonContainer }>
                  <div className={ styles.buttonDiv }>
                    <button
                      type='button'
                      onClick={
                        (e: any) => handleViewObserverResults(participant)
                      }
                    >
                      <p
                        style={ {
                          ...definitelyCenteredStyle,
                          position: 'relative',
                          marginRight: '4px',
                        } }
                      >
                        { `View Results` }
                      </p>
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
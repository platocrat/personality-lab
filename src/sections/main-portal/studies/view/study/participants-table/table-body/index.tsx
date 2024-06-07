// Externals
import { FC, Fragment } from 'react'
// Locals
import { ParticipantType } from '@/utils'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Styles
import { definitelyCenteredStyle } from '@/theme/styles'



type ParticipantsTableBodyProps = {
  participants: ParticipantType[] | null
}



const ParticipantsTableBody: FC<ParticipantsTableBodyProps> = ({
  participants,
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
            </tr>
          </Fragment>
        )) }
      </tbody>
    </>
  )
}


export default ParticipantsTableBody
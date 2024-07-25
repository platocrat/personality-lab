// Externals
import { FC, Fragment } from 'react'
// Locals
import { PARTICIPANT__DYNAMODB } from '@/utils'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Styles
import { definitelyCenteredStyle } from '@/theme/styles'



type ParticipantsTableBodyProps = {
  participants: PARTICIPANT__DYNAMODB[] | null
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
        { participants?.map((participant: PARTICIPANT__DYNAMODB, i: number) => (
          <Fragment key={ i }>
            <tr>
              <td style={{ width: isFullWidthTd }}>
                <p>{ i }</p>
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
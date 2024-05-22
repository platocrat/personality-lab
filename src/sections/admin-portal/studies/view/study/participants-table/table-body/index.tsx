// Externals
import { FC, Fragment } from 'react'
// Locals
import { ParticipantType } from '@/utils'
// Styles
import { tdOrThStyle } from '..'
import styles from '@/app/page.module.css'



type ParticipantsTableBodyProps = {
  participants: ParticipantType[] | null
  handleViewObserverResults: (e: any) => void
}



const ParticipantsTableBody: FC<ParticipantsTableBodyProps> = ({
  participants,
  handleViewObserverResults
}) => {
  return (
    <>
      <tbody>
        { participants?.map((participant: ParticipantType, i: number) => (
          <Fragment key={ i }>
            <tr>
              <td style={ tdOrThStyle }>
                <p>
                  <span>
                    <p>{ i }</p>
                  </span>
                </p>
              </td>
              <td style={ tdOrThStyle }>
                <p>
                  <span>
                    <p>{ participant.name }</p>
                  </span>
                </p>
              </td>
              <td style={ tdOrThStyle }>
                <p>
                  <span>
                    <p>{ participant.email }</p>
                  </span>
                </p>
              </td>
              <td style={ tdOrThStyle }>
                <p>
                  <span>
                    <p>{ }</p>
                  </span>
                </p>
              </td>
              <td style={ tdOrThStyle }>
                <p
                  className={ styles.externalLink }
                  style={ {
                    cursor: 'pointer',
                  } }
                  onClick={
                    (e: any) => handleViewObserverResults(
                      participant
                    )
                  }
                >
                  <span>
                    <p>{ `View Results` }</p>
                  </span>
                </p>
              </td>
            </tr>
          </Fragment>
        )) }
      </tbody>
    </>
  )
}


export default ParticipantsTableBody
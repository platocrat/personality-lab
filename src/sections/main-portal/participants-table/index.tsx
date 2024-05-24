// Externals
import { CSSProperties, FC, Fragment } from 'react'
// Locals
// Sections
import ParticipantTableHead from './table-head'
import ParticipantsTableBody from './table-body'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Utils
import { ParticipantType } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type ParticipantsTableProps = {
  isWaitingForResponse: boolean
  participants: ParticipantType[] | null
  handleViewObserverResults: (e: any) => void
}



export const tdOrThStyle: CSSProperties = {
  padding: '8px',
  textAlign: 'center',
  border: '1px solid #dddddd',
}




const ParticipantsTable: FC<ParticipantsTableProps> = ({
  participants,
  isWaitingForResponse,
  handleViewObserverResults,
}) => {
  return (
    <>
      { isWaitingForResponse ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
          <div
            style={ {
              width: '100%',
              margin: '20px 0',
              overflowX: 'auto',
            } }
          >
            <table
              style={ {
                width: '100%',
                margin: '0 auto',
                borderCollapse: 'collapse',
              } }
            >
              <ParticipantTableHead />
              <ParticipantsTableBody
                participants={ participants }
                handleViewObserverResults={ handleViewObserverResults }
              />
            </table>
          </div>
        </>
      ) }
    </>
  )
}


export default ParticipantsTable
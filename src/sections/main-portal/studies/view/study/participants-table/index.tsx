// Externals
import { CSSProperties, FC } from 'react'
// Locals
// Sections
import ParticipantTableHead from './table-head'
import ParticipantsTableBody from './table-body'
// Utils
import { ParticipantType } from '@/utils'
// CSS
import styles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'



type ParticipantsTableProps = {
  participants: ParticipantType[] | null
  handleViewObserverResults: (e: any) => void
}




const ParticipantsTable: FC<ParticipantsTableProps> = ({
  participants,
  handleViewObserverResults,
}) => {
  return (
    <>
      <div
        style={ {
          position: 'relative',
          width: '100%',
          margin: '20px 0',
        } }
      >
        <table className={ styles.table }>
          <ParticipantTableHead />
          <ParticipantsTableBody
            participants={ participants }
            handleViewObserverResults={ handleViewObserverResults }
          />
        </table>
      </div>
    </>
  )
}


export default ParticipantsTable
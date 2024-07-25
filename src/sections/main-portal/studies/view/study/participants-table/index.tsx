// Externals
import { CSSProperties, FC } from 'react'
// Locals
// Sections
import ParticipantTableHead from './table-head'
import ParticipantsTableBody from './table-body'
// Utils
import { PARTICIPANT__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/main-portal/studies/view/study/participants-table/ParticipantsTable.module.css'



type ParticipantsTableProps = {
  participants: PARTICIPANT__DYNAMODB[] | null
}




const ParticipantsTable: FC<ParticipantsTableProps> = ({
  participants,
}) => {
  return (
    <>
      <div
        style={ {
          position: 'relative',
          width: '100%',
        } }
      >
        <div 
          style={{ 
            ...definitelyCenteredStyle,
            marginBottom: '16px'
          }}
        >
          <h2>{ `Participants` }</h2>
        </div>
        <table 
          className={ styles.table }
          style={{ marginBottom: '24px' }}
        >
          <ParticipantTableHead />
          <ParticipantsTableBody participants={ participants } />
        </table>
      </div>
    </>
  )
}


export default ParticipantsTable
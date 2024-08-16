// Externals
import { CSSProperties, Dispatch, FC, SetStateAction } from 'react'
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
  state: {
    participants: PARTICIPANT__DYNAMODB[] | null
    setIsParticipantDeleted: Dispatch<SetStateAction<boolean>>
    setIsDeletingParticipant: Dispatch<SetStateAction<boolean>>
  }
}




const ParticipantsTable: FC<ParticipantsTableProps> = ({
  state,
}) => {
  // Constants
  const tableTitle = `Participants`


  // --------------------------- Async functions -------------------------------
  async function handleDeleteParticipant(participantId: string) {
    state.setIsDeletingParticipant(true)
    state.setIsParticipantDeleted(false)

    try {
      const response = await fetch('/api/study/participant', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId
        }),
      })

      const json = await response.json()

      if (response.status === 400) throw new Error(json.error)
      if (response.status === 404) throw new Error(json.message)
      if (response.status === 405) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      console.log(
        `[${new Date().toLocaleString()} --filepath="src/sections/main-portal/studies/view/study/participants-table/index.tsx" --function="handleDeleteParticipant()"]: json: `,
        json
      )

      const successMessage = json.message
      state.setIsDeletingParticipant(false)
      state.setIsParticipantDeleted(true)
    } catch (error: any) {
      state.setIsDeletingParticipant(false)
      state.setIsParticipantDeleted(false)
      throw new Error(error)
    }
  }



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
          <h2>
            { tableTitle }
          </h2>
        </div>
        <table 
          className={ styles.table }
          style={{ marginBottom: '24px' }}
        >
          <ParticipantTableHead />
          <ParticipantsTableBody 
            state={{
              handleDeleteParticipant,
              participants: state.participants,
            }}
          />
        </table>
      </div>
    </>
  )
}


export default ParticipantsTable
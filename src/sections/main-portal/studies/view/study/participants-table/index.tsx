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
    setParticipantsUpdated: Dispatch<SetStateAction<boolean>>
    setIsUpdatingParticipants: Dispatch<SetStateAction<boolean>>
    study: {
      id?: string
      ownerEmail?: string
      createdAtTimestamp?: number
      participants: PARTICIPANT__DYNAMODB[] | null
    }
  }
}




const ParticipantsTable: FC<ParticipantsTableProps> = ({
  state,
}) => {
  // Constants
  const tableTitle = `Participants`


  // --------------------------- Async functions -------------------------------
  /**
   * @dev Delete a single participant from the `studies` table using a POST operation
   * @param participantId
   */
  async function handleDeleteParticipant(
    participantId: string,
    participantEmail: string,
  ) {
    const confirmationMessage = 'Are you sure you want to delete this participant? \n\nThis action cannot be undone.'
    const isConfirmed = window.confirm(confirmationMessage)

    if (!isConfirmed) return

    state.setIsUpdatingParticipants(true)
    state.setParticipantsUpdated(false)

    try {
      /**
       * @todo `Delete` API route fails in GitHub Actions deployment
       */
      const response = await fetch('/api/study/participant', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          participantEmail,
          studyId: state.study.id,
          ownerEmail: state.study.ownerEmail,
          createdAtTimestamp: state.study.createdAtTimestamp,
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
      state.setIsUpdatingParticipants(false)
      state.setParticipantsUpdated(true)
    } catch (error: any) {
      state.setParticipantsUpdated(false)
      state.setIsUpdatingParticipants(false)
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
              participants: state.study.participants,
            }}
          />
        </table>
      </div>
    </>
  )
}


export default ParticipantsTable
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'


const InitiateGame = () => {
  const buttonText = `Start`
  const href = `social-rating/session/<GAME_SESSION_ID>`
  
  // ------------------------------- Regular functions -------------------------
  function generateSessionPin() {

  }

  function generateSessionQrCode() {

  }

  // ------------------------------- Async functions ---------------------------
  async function handleOnInitiateGame(e: any): Promise<void> {
    e.preventDefault()

    generateSessionPin()
    generateSessionQrCode()
  }

  

  return (
    <>
      <div>
        <ProgressBarLink href={ href }>
          <button 
            className={ styles['generate-button'] }
            onClick={ (e: any): Promise<void> => handleOnInitiateGame(e) }
          >
            { buttonText }
          </button>
        </ProgressBarLink>
      </div>
    </>
  )
}


export default InitiateGame
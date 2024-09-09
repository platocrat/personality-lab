// Externals
import { FC } from 'react'
// Locals
import styles from '@/sections/social-rating/games/fictional-characters/overview/instructions/Instructions.module.css'



type InstructionsProps = {

}




const Instructions: FC<InstructionsProps> = ({

}) => {
  return (
    <>
      <div className={ styles.container }>
        <div>
          { `Welcome to the social rating game!` }
        </div>
        <div>
          { `This game uses the Behavioral, Emotional, and Social Skills Inventory (BESSI) to determine one's personality scores.` }
        </div>
        <div style={ { marginBottom: '12px' } }>
          { `Here you can play a friendly game with others to rate each other to find out who has the closest personality to AI-generated pop-culture characters that are chosen by your game's host.` }
        </div>

        {/* Explanation of the BESSI */}
        <div>
          <div>
            <strong>
              { `What is the BESSI?` }
            </strong>
          </div>
          <div className={ styles.sentence }>
            {
              `The Behavioral, Emotional, and Social Skills Inventory (BESSI) is a comprehensive, reliable, valid, and efficient measure of social, emotional, and behavioral skills (SEB skills). It measures five major skill domains, which quickly summarize someone’s skills: Self-Management Skills, Social Engagement Skills, Cooperation Skills, Emotional Resilience Skills, and Innovation Skills.`
            }
          </div>
          <div>
            { `Across these five domains, the BESSI measures 32 specific skill facets.` }
          </div>
        </div>

        {/* Game mechanics */ }
        <div>
          <div>
            <strong>
              { `How does this game work?` }
            </strong>
          </div>
          <div className={ styles.sentence }>
            { `` }
          </div>
        </div>

        {/* Game instructions */ }
        <div>
          <div>
            <strong>
              { `Instructions:` }
            </strong>
          </div>
          <div>
            <div className={ styles.sentence }>
              {/* { `1. Starting the game` }
              <div className={ styles['list-item'] }>
                { `a. Similar to Kahoot` }
                { `, a host must invite other players using a game pin, via a link, or by scanning a QR code, so that everyone has an opportunity to rate someone else.` }
              </div>
              <div className={ styles['list-item'] }>
                { `b. Next, the host must allow players to join by clicking the blue "Start" button on their dashboard.` }
              </div>
              <div className={ styles['list-item'] }>
                { `c. Once the host starts the game's session, they will see the game pin and QR code displayed on a subsequent page.` }
              </div> */}
            </div>
            <div className={ styles.sentence }>
              {/* { `2. Joining a game` }
              <div className={ styles['list-item'] }>
                <div className={ styles['list-item'] }>
                  { `a. A player can join a game by using the game pin at the URL for the game's session. Simply navigate to the URL for the game's session where you will be prompted to provide the game pin.` }
                </div>
                <div className={ styles['list-item'] }>
                  { `b. You will have the option to provide a nickname for others to refer to you by. ` }
                </div>
                <div className={ styles['list-item'] }>
                  { `c. A player can also join via link. A host can copy the link by clicking on the game pin, which copies the URL of the game session to the host's clipboard. Then, the host can share the link with the other players. By inviting players using the link, players do not need to provide the game pin.` }
                </div>
                <div className={ styles['list-item'] }>
                  { `d. The third way a player can join a game is to scan the QR code for the game's session. This method of scanning the QR code is convenient when everyone is in the same room, such as in a classroom. The host can simply click on the QR code that is displayed to enlarge it for everyone to scan it with their preferred device.` }
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Instructions
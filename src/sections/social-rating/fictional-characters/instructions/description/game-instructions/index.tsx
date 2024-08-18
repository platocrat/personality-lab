// Locals
import ExternalLink from '@/components/Anchors/ExternalLink'
// CSS
import styles from '@/sections/social-rating/fictional-characters/instructions/description/game-instructions/GameInstructions.module.css'



const GameInstructions = () => {
  const noticeOnOpenAiModelUsed = `The LLM used for this social rating game is OpenAI's `


  return (
    <>
      <div className={ styles.container }>
        <div>
          { `Welcome to the social rating game!` }
        </div>
        <div style={{ marginBottom: '12px' }}>
          { `Here you can play a friendly game with others to rate each other to find out who has the closest personality to designated pop-culture characters.` }
        </div>

        {/* Game mechanics */ }
        <div>
          <div>
            <strong>
              { `How it works:` }
            </strong>
          </div>
          <div className={ styles.sentence }>
            { `This social rating game uses an AI, specifically, an LLM provided by ` }
            <ExternalLink 
              linkText={ `OpenAI` }
              options={{ target: '_blank' }}
              href={ `https://openai.com/api/` }
            />
            { ` to generate the fictional characters from popular culture.` }
          </div>
          <div className={ styles.sentence }>
            { `The purpose of the AI is not just to generate a concise description of the fictional character Rather, it is used to generate values for the personality metrics that are used to describe the personality a character.` }
          </div>
          <div className={ styles.sentence }>
            { `Once a host starts a new game session with a number of players, the host must then initiate the game by enter a list of prompts to generate a list of fictional pop-culture characters from.` }
          </div>
          <div className={ styles.sentence }>
            { `Listed below is an example of the kind of prompts that the host must provide as an input before clicking the "Generate" button:` }
          </div>
          <div className={ `${ styles['list-item']} ${ styles.sentence }` }>
            <li>
              { `"Generate a personality profile for a single character from Euphoria."` }
            </li>
            <li>
              { `"Generate a personality profile for a single character from The Big Bang Theory."` }
            </li>
            <li>
              { `"Generate a personality profile for a single character from American Horror Story."` }
            </li>
          </div>
          <div className={ styles.sentence }>
            { `Note that since an AI (a large-language model (LLM)), which is probabilistic, is used to generate the fictional pop-culture characters, there is a chance that more than one character may be generated even when specifying "for a single character".` }
          </div>
        </div>

        {/* Specify OpenAI model */ }
        <div>
          <div>
            <strong>
              { `LLM model used:` }
            </strong>
          </div>
          { noticeOnOpenAiModelUsed }
          <ExternalLink
            options={ { target: `_blank` } }
            linkText={ `gpt-4o-mini` }
            href={ `https://platform.openai.com/docs/models/gpt-4o-mini` }
          />
          { `.` }
        </div>

        {/* Game instructions */}
        <div>
          <div>
            <strong>
              { `Instructions:` }
            </strong>
          </div>
          <div>
            <div className={ styles.sentence }>
              { `1. Starting the game` }
              <div className={ styles['list-item'] }>
                { `a. Similar to ` }
                <ExternalLink 
                  linkText={ `Kahoot` }
                  options={{ target: '_blank' }}
                  href={ `https://www.youtube.com/watch?v=enFiKj4k_fo` }
                />
                { `, a host must invite other players using a game pin, via a link, or by scanning a QR code, so that everyone has an opportunity to rate someone else.` }
              </div>
              <div className={ styles['list-item'] }>
                { `b. Next, the host must allow players to join by clicking the blue "Start" button on their dashboard.` }
              </div>
              <div className={ styles['list-item'] }>
                { `c. Once the host starts the game's session, they will see the game pin and QR code displayed on a subsequent page.` }
              </div>
            </div>
            <div className={ styles.sentence }>
              { `2. Joining a game` }
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GameInstructions
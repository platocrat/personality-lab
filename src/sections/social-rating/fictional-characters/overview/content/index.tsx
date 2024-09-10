// Locals
// Sections
import NoticeOnInvalidOutput from '@/sections/social-rating/fictional-characters/overview/notice-on-invalid-output'
// Components
import ExternalLink from '@/components/Anchors/ExternalLink'
import Instructions from '@/components/SocialRating/Instructions'
// CSS
import styles from '@/sections/social-rating/fictional-characters/overview/content/Content.module.css'



const Content = () => {
  const NOTICE_ON_OPENAI_MODEL_USED = `The LLM used for this social rating game is OpenAI's `


  return (
    <>
      <div className={ styles.container }>
        <div className={ styles.text }>
          { `Welcome to the fictional characters social rating game!` }
        </div>
        <div className={ styles.text }>
          { `This game is enabled by generative AI.` }
        </div>
        <div className={ styles['text'] }>
          { `Here you can play a friendly game with others to rate each other to find out who has the closest personality to AI-generated pop-culture characters that are chosen by your game's host.` }
        </div>

        <div className={ styles['section-line-divider'] } />

        {/* Game mechanics */ }
        <div>
          <strong>
            { `How it works:` }
          </strong>
        </div>
        <div className={ styles.text }>
          { `This social rating game uses an AI, specifically, an LLM provided by ` }
          <ExternalLink 
            linkText={ `OpenAI` }
            options={{ target: '_blank' }}
            href={ `https://openai.com/api/` }
          />
          { ` to generate the fictional characters from popular culture.` }
        </div>
        <div className={ styles.text }>
          { `The purpose of the AI is not just to generate a concise description of the fictional character Rather, it is used to generate values for the personality metrics that are used to describe the personality a character.` }
        </div>
        <div className={ styles.text }>
          { `Once a host starts a new game session with a number of players, the host must then initiate the game by enter a list of prompts to generate a list of fictional pop-culture characters from.` }
        </div>
        <div className={ styles.text }>
          { `Listed below is an example of the kind of prompts that the host must provide as an input before clicking the "Generate" button:` }
        </div>
        <div className={ `${ styles['list-item']} ${ styles.text }` }>
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
        <div className={ styles['text-end'] }>
          { `Note that since an AI (a large-language model (LLM)), which is probabilistic, is used to generate the fictional pop-culture characters, there is a chance that more than one character may be generated even when specifying "for a single character".` }
        </div>
        
        <NoticeOnInvalidOutput />

        {/* Specify OpenAI model */ }
        <div>
          <strong>
            { `LLM model used:` }
          </strong>
        </div>
        <div className={ styles['text-end'] }>
          { NOTICE_ON_OPENAI_MODEL_USED }
          <ExternalLink
            options={ { target: `_blank` } }
            linkText={ `gpt-4o-mini` }
            href={ `https://platform.openai.com/docs/models/gpt-4o-mini` }
          />
          { `.` }
        </div>

        {/* Game instructions */}
        <Instructions />
      </div>
    </>
  )
}

export default Content
// Locals
import ExternalLink from '@/components/Anchors/ExternalLink'
// CSS
import styles from '@/sections/social-rating/SocialRating.module.css'



const GameMechanics = () => {
  return (
    <>
      <div>
        <strong>
          { `How does this game work?` }
        </strong>
      </div>
      <div className={ styles.text }>
        { `This social rating game uses an AI, specifically, an LLM provided by ` }
        <ExternalLink
          linkText={ `OpenAI` }
          options={ { target: '_blank' } }
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
      <div className={ `${styles['list-item']} ${styles.text}` }>
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
      <div className={ styles['text'] }>
        { `Note that since an AI (a large-language model (LLM)), which is probabilistic, is used to generate the fictional pop-culture characters, there is a chance that more than one character may be generated even when specifying "for a single character".` }
      </div>
    </>
  )
}

export default GameMechanics
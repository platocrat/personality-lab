// Externals
import { FC } from 'react'
// Locals
// Components
import LearnMore from '@/components/SocialRating/LearnMore'
import ExternalLink from '@/components/Anchors/ExternalLink'
import Instructions from '@/components/SocialRating/Instructions'
// Sections
import GameMechanics from './game-mechanics'
import NoticeOnInvalidOutput from './notice-on-invalid-output'
// CSS
import styles from '@/sections/social-rating/SocialRating.module.css'



type OverviewProps = {

}



const Overview: FC<OverviewProps> = ({
  
}) => {
  const NOTICE_ON_OPENAI_MODEL_USED = `The LLM used for this social rating game is OpenAI's `

  const title = (
    <>
      <div>
        { `AI-Generated` }
      </div>
      <div>
        { `Fictional Characters from Popular Culture` }
      </div>
    </>
  )



  return (
    <>
      <div
        className={ styles.container }
        style={ {
          margin: '0px',
          textAlign: 'left',
        } }
      >
        <h2>
          { title }
        </h2>

        <div className={ styles.container }>
          {/* <div className={ styles.text }>
            { `Welcome to the fictional characters social rating game!` }
          </div> */}
          <div className={ styles.text }>
            { `This game is enabled by generative AI.` }
          </div>
          <div className={ styles.text }>
            { `It also uses the BESSI (see the description for the BESSI social rating game to learn more).` }
          </div>
          <div className={ styles['text'] }>
            { `Here you can play a friendly game with others to rate each other to find out who has the closest personality to AI-generated pop-culture characters that are chosen by your game's host.` }
          </div>

          <LearnMore
            content={ (
              <>
                <div className={ styles['section-line-divider'] } />
                <GameMechanics />
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
              </>
            ) }
          />
        </div>
      </div>
    </>
  )
}


export default Overview
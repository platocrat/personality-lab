// Externals
import { FC } from 'react'
// Locals
import Instructions from '@/components/SocialRating/Instructions'
// CSS
import styles from '@/sections/social-rating/fictional-characters/overview/content/Content.module.css'



type ContentProps = {

}




const Content: FC<ContentProps> = ({

}) => {
  return (
    <>
      <div className={ styles.container }>
        <div className={ styles.text }>
          { `Welcome to the social rating game!` }
        </div>
        <div className={ styles.text }>
          { `This game uses the Behavioral, Emotional, and Social Skills Inventory (BESSI) to determine one's personality scores.` }
        </div>
        <div className={ styles['text'] }>
          { `Here you can play a friendly game with others to rate each other to find out who has the closest personality to AI-generated pop-culture characters that are chosen by your game's host.` }
        </div>

        <div className={ styles['section-line-divider'] } />

        {/* Explanation of the BESSI */}
        <div>
          <strong>
            { `What is the BESSI?` }
          </strong>
        </div>
        <div className={ styles.text }>
          {
            `The Behavioral, Emotional, and Social Skills Inventory (BESSI) is a comprehensive, reliable, valid, and efficient measure of social, emotional, and behavioral skills (SEB skills). It measures five major skill domains, which quickly summarize someone’s skills: Self-Management Skills, Social Engagement Skills, Cooperation Skills, Emotional Resilience Skills, and Innovation Skills.`
          }
        </div>
        <div className={ styles['text-end'] }>
          { `Across these five domains, the BESSI measures 32 specific skill facets.` }
        </div>

        {/* Game mechanics */ }
        <div>
          <strong>
            { `How does this game work?` }
          </strong>
        </div>
        <div className={ styles.text }>
          { `` }
        </div>

        {/* Game instructions */ }
        <Instructions />
      </div>
    </>
  )
}


export default Content
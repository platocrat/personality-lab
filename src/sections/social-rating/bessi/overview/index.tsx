'use client'

// Externals
import { FC, useState } from 'react'
// Locals
import LearnMore from '@/components/SocialRating/LearnMore'
// Sections
import GameMechanics from './game-mechanics'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/SocialRating.module.css'



type OverviewProps = {

}



const Overview: FC<OverviewProps> = ({

}) => {
  const title = (
    <>
      <div>
        { `The BESSI` }
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
        {/* <div className={ styles.text }>
            { `Welcome to the social rating game!` }
          </div> */}
        <div className={ styles.text }>
          { `This game uses the Behavioral, Emotional, and Social Skills Inventory (BESSI) to determine one's personality scores.` }
        </div>
        <div className={ styles['text'] }>
          { `Here you can play a friendly game with others to rate each other to find out who has the closest personality to AI-generated pop-culture characters that are chosen by your game's host.` }
        </div>

        <LearnMore 
          content={ (
            <>
              <div className={ styles['section-line-divider'] } />
              <div>
                <strong>{ `What is the BESSI?` }</strong>
              </div>
              <div className={ styles.text }>
                { `The Behavioral, Emotional, and Social Skills Inventory (BESSI) is a comprehensive, reliable, valid, and efficient measure of social, emotional, and behavioral skills (SEB skills). It measures five major skill domains, which quickly summarize someone’s skills: Self-Management Skills, Social Engagement Skills, Cooperation Skills, Emotional Resilience Skills, and Innovation Skills.` }
              </div>
              <div className={ styles['text-end'] }>
                { `Across these five domains, the BESSI measures 32 specific skill facets.` }
              </div>

              <GameMechanics />
            </>
          ) }
        />
      </div>
    </>
  )
}


export default Overview
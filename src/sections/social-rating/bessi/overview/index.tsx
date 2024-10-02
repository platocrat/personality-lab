'use client'

// Externals
import { FC } from 'react'
// Locals
import LearnMore from '@/components/SocialRating/LearnMore'
// Sections
import GameMechanics from './game-mechanics'
// CSS
import styles from '@/sections/social-rating/SocialRating.module.css'



type OverviewProps = {

}



const GAME_ID = `bessi`



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
        {/* <h2>
          { title }
        </h2> */}
        {/* <div className={ styles.text }>
            { `Welcome to the social rating game!` }
          </div> */}
        <div className={ styles.text }>
          { 
            `In this version of the game, you’ll be rating your friends social, emotional, and behavioral skills (SEB skills).`
            }
        </div>
        <div className={ styles.text }>
          { 
            `That means we want to know how good your friends are at leadership, teamwork, stress management, innovation, and self-discipline.`
            }
        </div>
        <div className={ styles.text }>
          { 
            `We don’t want to know what they typically do (that’s the next version of the game). We want to know what they can do in each of these domains when they try really hard to do their very best.`
            }
        </div>
        <div className={ styles.text }>
          { 
            `When you are all done rating yourself and your friends, we will show you how well your scores matched your friends’ ratings and we’ll show you who was the Best Judge of Character.`
          }
        </div>
        <div className={ styles.text }>
          { `Here’s how the game works.` }
          <div className={ styles.text }>
            <div className={ styles['list-item'] }>
              { `1. First, you’ll rate your SEB skills.` }
            </div>
            <div className={ styles['list-item'] }>
              { `2. Then, you’ll invite your friends if you’re the first to play (or they will have invited you).` }
            </div>
            <div className={ styles['list-item'] }>
              { `3. Then, you’ll rate each of your friends who are playing.` }
            </div>
            <div className={ styles['list-item'] }>
              { `4. We’ll match your ratings of your friend with the rating they made of themselves.` }
            </div>
            <div className={ styles['list-item'] }>
              { `5. Whoever matches their friends' ratings better on average, wins.` }
            </div>
          </div>
        </div>
        <div className={ styles['text'] }>
          { `Let’s get started.` }
        </div>

        {/* <LearnMore 
          content={ (
            <>
              <div className={ styles['section-line-divider'] } />
              <div>
                <strong>{ `What is the BESSI?` }</strong>
              </div>
              <div className={ styles.text }>
                { 
                  `The Behavioral, Emotional, and Social Skills Inventory (BESSI) is a comprehensive, reliable, valid, and efficient measure of social, emotional, and behavioral skills (SEB skills). It measures five major skill domains, which quickly summarize someone’s skills: Self-Management Skills, Social Engagement Skills, Cooperation Skills, Emotional Resilience Skills, and Innovation Skills.` 
                }
              </div>
              <div className={ styles['text-end'] }>
                { `Across these five domains, the BESSI measures 32 specific skill facets.` }
              </div>
              <div>
                <strong>{ `How does the BESSI work?` }</strong>
              </div>
              <div className={ styles['text-end'] }>
                { 
                  `The BESSI uses a skill inventory format. This means that each BESSI item describes a specific, skill-relevant behavior, and the user rates how well they (or a target person, if they are rating someone else) can perform that behavior. The user’s item ratings are averaged together to measure five major skill domains and 32 specific skill facets.`
                }
              </div>

              <GameMechanics />
            </>
          ) }
        /> */}
      </div>
    </>
  )
}


export default Overview
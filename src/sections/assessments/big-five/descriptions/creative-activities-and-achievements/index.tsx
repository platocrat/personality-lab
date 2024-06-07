// Externals
import Image from 'next/image'
// Locals
import AssessmentButton from '@/components/Buttons/Assessment'
import { BIG_FIVE_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


const href = `${ BIG_FIVE_ASSESSMENT_HREF }/creative-activities-and-achievements/literature`
const imgPath = (i: number) => `/assessments/big-five/creativity-and-achievements-instructions-${i}.png`



const CreativeActivitesAndAchievementsDescription = () => {
  return (
    <>
      <div className={ styles.assessmentWrapper }>
        
        <div>
          <h3>{ `General Instructions:` }</h3>
          <p>
            {
              `This inventory asks you to report your creative activities and achievements. The inventory contains eight different domains (e.g., literature, music, and performing arts). You will be asked three questions for each of these domains.`
            }
          </p>
        </div>
        
        <div style={{ margin: '24px 0px' }}>
          <h4>{ `Example:` }</h4>
          <p>
            {
              `If you already invented your own magic trick four times, but never invented your own circus program, mark the boxes as follows:`
            }
          </p>
        </div>

        <div style={ { margin: '24px 0px' } }>
          <em>{`Question 1:` }</em>
          <p>
            {
              `Specify how many times you have carried out a certain activity over the last 10 years.`
            }
          </p>
          <div style={ { margin: '12px 0px' } }>
            <em style={ { textDecoration: 'underline' } }>
              { `Example:` }
            </em>
            <p>
              {
                `If you already invented your own magic trick four times, but never invented your own circus program, mark the boxes as follows:`
              }
            </p>
          </div>

          <div
            style={ {
              ...definitelyCenteredStyle,
              margin: '24px 0px'
            } }
          >
            <Image
              width={ 720 }
              height={ 160 }
              src={ imgPath(1) }
              className={ styles.img }
              alt='Instructions example 1'
              style={{
                width: `100%`,
                height: `100%`,
              }}
            />
          </div>
        </div>


        <div style={ { margin: '24px 0px' } }>
          <em>{`Question 2:` }</em>
          <p>
            { 
              `In question 2, please specify the level of achievement you have attained in the particular field. You are given the same eleven choices in every domain. Please check all statements that describe your level of achievement in the whole field.`
            }
          </p>
          <div style={ { margin: '12px 0px' } }>
            <em style={ { textDecoration: 'underline' } }>
              { `Example:` }
            </em>
            <p>
              {
                ` If you already invented magic tricks, then you already tried this domain and produced your own original work. If you already showed them to friends but not yet to strangers, please mark the boxes as follows:`
              }
            </p>
          </div>

          <div 
            style={{
              ...definitelyCenteredStyle,
              margin: '24px 0px'
            }}
          >
            <Image
              width={ 792 }
              height={ 160 }
              objectFit='contain'
              src={ imgPath(1) }
              alt='Instructions example 2'
              style={ {
                width: `100%`,
                height: `100%`,
              } }
            />
          </div>
        </div>


        <div style={ { margin: '24px 0px' } }>
          <em>{`Question 3:` }</em>
          <p>
            { 
              ` Please state for how many years of your life you have already been engaged in this domain. Consider only voluntary activities of the particular domain, and ignore any activities that you were required to do, e.g. for school.`
            }
          </p>
          <div style={ { margin: '12px 0px' } }>
            <em style={ { textDecoration: 'underline' } }>
              { `Example – Field Humor:` }
            </em>
            <p>
              {
                ` If you have been inventing magic tricks for 3 years and have been making up funny short stories for 5 years, your answer to this question should be: 5 years.`
              }
            </p>
          </div>
        </div>

        <AssessmentButton href={ href } buttonText={ 'Next' } />
      </div>
    </>
  )
}


export default CreativeActivitesAndAchievementsDescription
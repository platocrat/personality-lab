// Externals
import Image from 'next/image'
// Locals
import AssessmentButton from '@/app/components/assessment-button'
import { genderAndCreativityUsAssessmentHref } from '../../forms/consent'
// CSS
import styles from '@/app/page.module.css'


const href = `${genderAndCreativityUsAssessmentHref}/creative-activities-and-achievements/assessment`
const imgPath = (i: number) => `./assessments/gender-and-creativity-us/creativity-and-achievements-instructions-${i}.png`



const CreativeActivitesAndAchievementsDescription = () => {
  return (
    <>
      <div>
        
        <div>
          <h3>{ `General Instructions:` }</h3>
          <p>
            {
              `This inventory asks you to report your creative activities and achievements. The inventory contains eight different domains (e.g., literature, music, and performing arts). You will be asked three questions for each of these domains.`
            }
          </p>
        </div>
        <div>
          <h4>{ `Example:` }</h4>
          <p>
            {
              `If you already invented your own magic trick four times, but never invented your own circus program, mark the boxes as follows:`
            }
          </p>
        </div>
        <div>
          <em>{`Question 1:` }</em>
          <p>
            {
              `Specify how many times you have carried out a certain activity over the last 10 years.`
            }
          </p>
          <div>
            <em style={ { textDecoration: 'underline' } }>
              { `Example:` }
            </em>
            <p>
              {
                `If you already invented your own magic trick four times, but never invented your own circus program, mark the boxes as follows:`
              }
            </p>
          </div>

          <Image
            width={ 20 }
            height={ 20 }
            alt='Instructions example 1'
            className={ styles.img }
            src={ imgPath(0) }
          />
        </div>


        <div>
          <em>{`Question 2:` }</em>
          <p>
            { 
              `In question 2, please specify the level of achievement you have attained in the particular field. You are given the same eleven choices in every domain. Please check all statements that describe your level of achievement in the whole field.`
            }
          </p>
          <div>
            <em style={ { textDecoration: 'underline' } }>
              { `Example:` }
            </em>
            <p>
              {
                ` If you already invented magic tricks, then you already tried this domain and produced your own original work. If you already showed them to friends but not yet to strangers, please mark the boxes as follows:`
              }
            </p>
          </div>

          <Image
            width={ 20 }
            height={ 20 }
            alt='Instructions example 2'
            className={ styles.img }
            src={ imgPath(1) }
          />
        </div>


        <div>
          <em>{`Question 3:` }</em>
          <p>
            { 
              ` Please state for how many years of your life you have already been engaged in this domain. Consider only voluntary activities of the particular domain, and ignore any activities that you were required to do, e.g. for school.`
            }
          </p>
          <div>
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
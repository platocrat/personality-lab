'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useEffect, useState } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
import CreativityAndAchievementsForm from '@/components/Forms/BigFive/CreativityAndAchievements'
// Utils
import { 
  BIG_FIVE_ASSESSMENT_HREF,
  BIG_FIVE_FRAGMENT_ID_PREFACES,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import FormButton from '@/components/Buttons/Form'



const href = `${BIG_FIVE_ASSESSMENT_HREF}/task-enjoyment`

const BUTTON_TEXT = `Next`
const QUESTION_TEXT = `Please name your overall five most creative achievements in your life so far. Select those achievements that you think will help someone else to evaluate your actual creativity.Your responses can come from domains other than those captured by the previous inventory. Start by naming your most creative achievement, then your second - most creative achievement, and so on. Describe each achievement by writing a brief sentence in the boxes below. If there are fewer than five relevant achievements, just leave the remaining boxes empty.`



type FiveMostCreativeAchievementsFormProps = {
  pageFragmentId: string
}



const FiveMostCreativeAchievementsForm: FC<FiveMostCreativeAchievementsFormProps> = ({
  pageFragmentId
}) => {
  // hooks
  const router = useRouter()
  // States
  const [ userResponses, setUserResponses ] = useState<any>({})
  const [ creativeAchievements, setCreativeAchievements ] = useState<any>({})


  
  const FRAGMENT_KEY_PREFACE = BIG_FIVE_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )

  const getFragmentKey = (i: number): string => `${FRAGMENT_KEY_PREFACE}-${i}`


  
  function onCreativeAchievementChange(e: any, itemIndex: number) {
    const _ = e.target.value

    setCreativeAchievements({
      ...creativeAchievements,
      [ `${ itemIndex }` ]: _
    })
  }
  

  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()
    setUserResponses(creativeAchievements)
    await storeResponsesInLocalStorage(userResponses)
    router.push(href)
  }


  async function storeResponsesInLocalStorage(userResponses) {
    const key = FRAGMENT_KEY_PREFACE
    const value = JSON.stringify(userResponses)
    localStorage.setItem(key, value)
  }

  
  // Test that data is being stored
  useEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponses: `, userResponses)
  }, [userResponses])




  
  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any)  => handleOnSubmit(e) }
      >
        <div>
          <p>
            { QUESTION_TEXT }
          </p>
        </div>

        <div 
          style={{
            ...definitelyCenteredStyle,
            flexDirection: 'column',
            marginTop: '24px',
          }}
        >
          { [1, 2, 3, 4, 5].map((_, i: number) => (
            <Fragment key={ getFragmentKey(i) }>
              <div 
                style={{ 
                  display: 'flex',
                  marginBottom: '18px',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    position: 'relative',
                    top: '8px',
                    marginRight: '4px'
                  }}
                >
                  { _ }
                </label>
                <TextOrNumberInput
                  style={{ 
                      height: '36px',
                      width: '400px',
                  }}
                  name={ pageFragmentId }
                  onChange={ (e: any) => onCreativeAchievementChange(e, _) }
                />
              </div>
            </Fragment>
          )) }
        </div>
        
        <FormButton buttonText={ BUTTON_TEXT } />

      </form>
    </>
  )
}


export default FiveMostCreativeAchievementsForm
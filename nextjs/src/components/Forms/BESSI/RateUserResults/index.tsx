// Externals
import { FC, useState } from 'react'
// Locals
import { BessiSkillScoresType } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type BessiRateUserResultsType = {
  bessiSkillScores: BessiSkillScoresType | null
}



const BessiRateUserResults: FC<BessiRateUserResultsType> = ({
  bessiSkillScores
}) => {
  const [rating, setRating] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState('')


  function handleRatingChange (e: any)  {
    const rating = e.target.value
    setRating(rating)
  }


  async function handleSubmit (e: any): Promise<void>  {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Use the fetch API to send a POST request
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: 'User Rating Submission',
          message: `User has rated the results: ${rating}/5`,
        })
      })

      if (!response.ok) throw new Error('Network response was not ok.')

      setSubmissionStatus('Rating submitted successfully!')
    } catch (error) {
      console.error('Failed to submit rating', error)
      setSubmissionStatus('Failed to submit rating.')
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <>
      <form 
        style={{
          ...definitelyCenteredStyle,
          margin: '24px 8px'
        }}
        onSubmit={ (e: any): Promise<void> => handleSubmit(e) }
      >
        <label htmlFor='rating'>
          {`Rate scores?:`}
        </label>

        <select
          id='rating'
          value={ rating }
          style={{
            ...definitelyCenteredStyle,
            margin: '0px 12px',
            padding: '2px 8px'
          }}
          onChange={ (e: any) => handleRatingChange(e) }
          required
        >
          <option value=''>Select a rating</option>
          <option value='1'>1 - Poor</option>
          <option value='2'>2 - Fair</option>
          <option value='3'>3 - Good</option>
          <option value='4'>4 - Very Good</option>
          <option value='5'>5 - Excellent</option>
        </select>

        <button 
          type='submit' 
          disabled={ isSubmitting }
          style={ {
            ...definitelyCenteredStyle,
            padding: '2px 8px'
          } }
        >
          { isSubmitting ? 'Submitting...' : 'Submit Rating' }
        </button>

        { submissionStatus && <div>{ submissionStatus }</div> }

      </form>
    </>
  )
}


export default BessiRateUserResults
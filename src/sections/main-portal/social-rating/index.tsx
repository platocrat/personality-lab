// Externals
import { FC } from 'react'
// Locals
import Question from '@/components/Quiz/Question'



type SocialRatingProps = {
  
}




const SocialRating: FC<SocialRatingProps> = ({

}) => {
  const question = "What do you call someone who relies on practical judgments rather than principles?"
  const imageSrc = "vercel.svg" // Replace with your image path
  const options = [
    { text: 'Pragmatic', isCorrect: true },
    { text: 'Idealistic', isCorrect: false },
    { text: 'Dogmatic', isCorrect: false },
    { text: 'Pessimistic', isCorrect: false },
  ]





  return (
    <>
      <div>
        <Question 
          question={ question } 
          imageSrc={ imageSrc } 
          options={ options } 
        />
      </div>
    </>
  )
}


export default SocialRating
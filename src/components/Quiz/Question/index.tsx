import Image from 'next/image'
import './Question.module.css' // Import the CSS file for styling



const Question = ({ question, imageSrc, options }) => {
  return (
    <div className='question-component'>
      <div className='question-header'>
        <h2>{ question }</h2>
      </div>
      <div className='image-container'>
        <Image 
          src={ imageSrc } 
          width={ '40' }
          height={ '40' }
          alt='Question illustration' 
        />
      </div>
      <div className='options-container'>
        { options.map((option, index) => (
          <div key={ index } className={ `option ${option.isCorrect ? 'correct' : ''}` }>
            { option.text }
          </div>
        )) }
      </div>
    </div>
  )
}


export default Question
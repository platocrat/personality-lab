// Locals
// Sections
import SocialRatingInstructionsDescription from './description'



type SocialRatingInstructionsProps = {
}



const SocialRatingInstructions = ({}) => {
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
      {/* Title */}
      <h2>
        { title }
      </h2>

      {/* Instructions */}
      {/**
       * @todo Include instructions for how to play the social rating game
       */}
      <SocialRatingInstructionsDescription />
    </>
  )
}


export default SocialRatingInstructions
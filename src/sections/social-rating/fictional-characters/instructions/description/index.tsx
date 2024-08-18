import ExternalLink from "@/components/Anchors/ExternalLink"

type SocialRatingInstructionsDescriptionProps = {
  
}


const SocialRatingInstructionsDescription = () => {
  const noticeOnOpenAiModelUsed = `The LLM used for this social rating game is OpenAI's `
  const noticeWhenPromptFails = `Since this model is not as advanced as OpenAI's other models, and given that every model is probabilistic, `



  return (
    <>
      <div 
        style={{
          padding: '12px',
          display: 'grid',
          gridGap: '12px',
          margin: '12px 0px 0px 0px',
        }}
      >
        <div>
          { noticeOnOpenAiModelUsed }
          <ExternalLink
            options={{ target: `_blank` }}
            linkText={ `gpt-4o-mini` } 
            href={ `https://platform.openai.com/docs/models/gpt-4o-mini` }
          />
          { `.` }
        </div>
        <div 
          style={ { 
            padding: '8px',
            fontSize: '13.85px',
            marginTop: '12px', 
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
          }}
        >
          <div>
            <strong>
              { `Notice on AI-generated content that is in an invalid format:` }
            </strong>
          </div>
          <div style={{ padding: '8px 0px' }}>
            { noticeWhenPromptFails }
            <em>
              { `there is always a chance that the text that is returned from the model is in an invalid format that will not be parsed properly and will result in an error. ` }
            </em>
            <br />
            <br />
            { `If that happens, simply refresh the page and try to regenerate the characters again.` }
          </div>
        </div>
      </div>
    </>
  )
}



export default SocialRatingInstructionsDescription
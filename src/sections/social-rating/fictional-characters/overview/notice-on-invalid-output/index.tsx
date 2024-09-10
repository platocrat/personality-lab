import styles from '@/sections/social-rating/fictional-characters/overview/notice-on-invalid-output/NoticeOnInvalidOutput.module.css'



const NoticeOnInvalidOutput = () => {
  const noticeWhenPromptFails = `Since this model is not as advanced as OpenAI's other models, and given that every model is probabilistic, `


  return (
    <>
      <div className={ styles.container }>
        <div className={ styles.header }>
          <strong>
            { `⚠️ Notice on AI-generated content that is in an invalid format ⚠️` }
          </strong>
        </div>
        <div className={ styles.notice }>
          { noticeWhenPromptFails }
          <em>
            { `there is always a chance that the text that is returned from the model is in an invalid format that will not be parsed properly and will result in an error. ` }
          </em>
          <br />
          <br />
          { `If that happens, simply refresh the page and try to regenerate the characters again.` }
        </div>
      </div>
    </>
  )
}

export default NoticeOnInvalidOutput
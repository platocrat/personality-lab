// Externals
import Link from 'next/link'
// Locals
// CSS
import styles from '@/app/page.module.css'

const BessiConsentForm = () => {
  const title = `Consent Form`
  const href = `/bessi/assessment`

  return (
    <>
      <div
        className={ styles.assessmentSubtitle }
        style={ { marginTop: '20px' } }
      >
        <h4>{ title }</h4>
        <p>
          {
            `By completing the following questionnaire, you agree to have your answers recorded for use in research. There are no foreseeable risks to you from participating in this research, the results of which are free. The benefits to you consist of feedback about your social, emotional, and behavioral skills, which may provide you with greater insight about yourself. Your participation in this research is completely voluntary. If the data and results of this research are published or otherwise shared, they will not include any personally identifying information. You may refuse to answer any of the questions, and you may withdraw your consent and discontinue participation in this study at any time.`
          }
          <br />
          <br />
          { `Your results will be displayed as soon as you submit your answers.` }
          <br />
          <br />
          { `The questionnaire will take about 20 minutes to complete.` }
        </p>
      </div>

      <div
        className={ styles.assessmentSubtitle }
        style={ { marginTop: '20px' } }
      >
        <div>
          <p>{ `Note:` }</p>
        </div>

        <ul style={ { margin: '8px 0px 48px 18px' } }>
          <li style={ { marginBottom: '8px' } }>
            {
              `There are no "right" or "wrong" answers, but note that you will not obtain meaningful results unless you answer the questions seriously.`
            }
          </li>
          <li style={ { marginBottom: '8px' } }>
            {
              `These results are being used in scientific research, so please try to give accurate answers.`
            }
          </li>
          <li style={ { marginBottom: '8px' } }>
            { `Your results will be displayed as soon as you submit your answers.` }
          </li>
        </ul>
      </div>

      <div style={ { float: 'right' } }>
        <Link href={ href }>
          <button className={ styles.button }>
            { `I agree` }
          </button>
        </Link>
      </div>
    </>
  )
}

export default BessiConsentForm
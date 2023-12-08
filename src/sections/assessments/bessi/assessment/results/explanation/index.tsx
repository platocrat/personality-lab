import styles from '@/app/page.module.css'


const Description = () => {
  const section1 = `Social, emotional, and behavioral skills (SEB skills) are capacities that people use to maintain their social relationships, regulate their emotions, manage their goals, and learn from experience. The questionnaire you just completed is the Behavioral, Emotional, and Social Skills Inventory, or BESSI for short, developed by researchers Christopher J. Soto, Christopher M. Napolitano, and Brent W. Roberts. As its name suggests, the BESSI is designed to measure a wide variety of SEB skills.`
  const section2 = `The BESSI provides scores on 32 specific SEB skills (skill facets) organized within five broad skill domains: Self-Management, Social Engagement, Cooperation, Emotional Resilience, and Innovation Skills. Your scores on all of these skills are presented in the table below, along with a brief definition of each skill.`

  return (
    <>
      <div>
        <p>{ section1 }</p>
        <br />
        <p>{ section2 }</p>
      </div>
    </>
  )
}


const BessiResultsExplanation = () => {
  const title = `Your Feedback`
  const subtitle = `Social, Emotional, and Behavioral Skills and the BESSI`
  const marginBottomStyle = {
    marginBottom: '12px'
  }

  return (
    <>
      <div>
        <div style={ { textAlign: 'center', ...marginBottomStyle } }>
          <h2 style={{ fontSize: '26px' }}>{ title }</h2>
        </div>

        <div style={marginBottomStyle}>
          <h3>{ subtitle }</h3>
        </div>

        <Description />
      </div>
    </>
  )
}

export default BessiResultsExplanation
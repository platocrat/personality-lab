// Locals
import BessiResultsVisualization from '../assessment/results/bessi-results-visualization'


const isExample = true



const BessiDescription = ({ }) => {
  return (
    <>
      {
        `This assessment is called the Behavioral, Emotional, and Social Skills Inventory (BESSI) developed by `
      }
      <a
        style={ { color: '#007ac0', textDecoration: 'underline' } }
        href={ `https://psychology.illinois.edu/directory/profile/bwrobrts` }
        target='_blank'
      >
        { `Brent W. Roberts` }
      </a>
      {
        `, Christopher J. Soto, Christopher Napolitano, Madison Sewell, and Heejun Yoon. The BESSI measures specific skills across five broad categories: Self-Management, Social Engagement, Cooperation, Emotional Resilience, and Innovation.`
      }
      <br />
      <br />
      {
        `The BESSIE uses a skills inventory format, meaning that each BESSI item describes a specific, skill-relevant behavior, and users rate how well they can perform that behavior.`
      }

      <div>
        <h3
          style={ {
            fontSize: '22px',
            marginTop: '28px',
          } }
        >
          { `Example Visualizations` }
        </h3>
      </div>

      <BessiResultsVisualization isExample={ isExample } />

      <br />
      <br />
      { `Click the button below to begin the assessment.` }
      <br />
      { `Please note that we do not store any information from these assessments` }
    </>
  )
}


export default BessiDescription
// Locals
import EntranceNote from '@/components/Notes/Entrance'
import BessiResultsVisualization from '../assessment/results/bessi-results-visualization'
// CSS
import styles from '@/app/page.module.css'


const isExample = true



const Description = () => {
  return (
    <>
      {
        `This assessment is called the Behavioral, Emotional, and Social Skills Inventory (BESSI) developed by `
      }
      <a
        className={ styles.externalLink }
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
    </>
  )
}



const BessiDescription = ({ }) => {
  return (
    <>
      <Description />
      <BessiResultsVisualization isExample={ isExample } />
      <EntranceNote />
    </>
  )
}


export default BessiDescription
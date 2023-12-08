import styles from '@/app/page.module.css'


const BessiWantToLearnMore = () => {
  const title = `Want to Learn More?`

  return (
    <>
      <div 
        style={{ 
          margin: '18px 0px 0px 0px',
          lineHeight: '18px'
        }}
      >
        <p style={ { marginBottom: '16px' } }>
          <strong>
            <span className={ styles.bessi_header2 }>
              { title }
            </span>
          </strong>
        </p>
        <p style={ { marginBottom: '16px' } }>
          <span className={ styles.bessi_text1 }>
            {
              `Here are a couple suggestions for places to learn more about social, emotional, and behavioral skills.`
            }
          </span>
        </p>
        <p style={ { marginBottom: '16px' } }>
          <span className={ styles.bessi_text1 }>
            { `The Social-Emotional-Behavioral Skills Lab:` }
            <br />
            <a 
              target='_blank'
              href="https://sebskills.weebly.com"
              style={ { color: '#007ac0', textDecoration: 'underline' } }
            >
              { `SEB Skills Lab` }
            </a>
          </span>
        </p>
        <p>
          <span className={ styles.bessi_text1 }>
            {
              `A scientific journal article about social, emotional, and behavioral skills:`
            }
            <br />
            <a
              style={ { color: '#007ac0', textDecoration: 'underline' } }
              target='_blank'
              href="https://www.frontiersin.org/articles/10.3389/feduc.2021.679561/full"
            >
              {
                `Social, Emotional, and Behavioral Skills: An Integrative Model of the Skills Associated With Success During Adolescence and Across the Life Span`
              }
            </a>
          </span>
        </p>
      </div>
    </>
  )
}

export default BessiWantToLearnMore
// Externals
import { FC, Fragment } from 'react'
// Locals
import ConsentForm from './consent-form'
// CSS
import styles from '@/app/page.module.css'


type BessiProps = {
  onCompletion?: (e: any) => void
}


const title = `BESSI`
const subtitle = `Complete the following questionnaire to learn more about your social, emotional, and behavioral skills. These are the skills that you use to start and support your relationships, keep your emotions in check, achieve your goals, and learn from experience. They’re things like goal setting, leadership, teamwork, creativity, and emotion regulation.`





const Bessi: FC<BessiProps> = ({ 
  onCompletion,
}) => {
  return (
    <Fragment key={ `bessi-consent-form` }>
      <div className={ styles.assessmentWrapper }>
        <div className={ styles.grayColor }>
          <h2 className={ styles.assessmentTitle }>{ title.toUpperCase() }</h2>
          <h3>{ subtitle }</h3>
          <ConsentForm onCompletion={ onCompletion } />
        </div>
      </div>
    </Fragment>
  )
}

export default Bessi
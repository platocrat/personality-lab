// Externals
import { FC } from 'react'
// Locals
import study from '..'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import styles from './StudyHeader.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/main-portal/studies/view/study/ViewStudy.module.css'


type StudyHeaderProps = {
  isCopied: boolean
  study?: STUDY__DYNAMODB
  handleCopyInviteLink: () => void
}




const StudyHeader: FC<StudyHeaderProps> = ({
  study,
  isCopied,
  handleCopyInviteLink,
}) => {
  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column'
        } }
      >
        {/* Study Name */ }
        <h2 style={ { marginBottom: '4px' } }>
          { `${study?.name}` }
        </h2>
        {/* Study ID */ }
        <div
          className={ styles.studyId }
          style={ {
            ...definitelyCenteredStyle,
            fontSize: '13px',
            color: 'gray',
          } }
        >
          <div
            style={ {
              ...definitelyCenteredStyle,
              marginRight: '12px',
            } }
          >
            <p style={ { marginRight: '8px' } }>
              { `ID: ` }
            </p>
            <p>
              { `${study?.id}` }
            </p>
          </div>
          {/* Study Invite Link */ }
          <div>
            <button
              onClick={ handleCopyInviteLink }
              className={
                `${sectionStyles.copyInviteLink} ${
                  isCopied
                    ? sectionStyles.copied
                    : ''
                }`
              }
            >
              { isCopied ? 'Copied!' : 'Copy Invite Link' }
            </button>
          </div>
        </div>
        {/* Study Description */ }
        <div
          style={ {
            fontSize: '14px',
            textAlign: 'left',
            margin: '12px 48px 24px 48px',
          } }
        >
          <p>{ `${study?.details.description}` }</p>
        </div>
      </div>
    </>
  )
}


export default StudyHeader
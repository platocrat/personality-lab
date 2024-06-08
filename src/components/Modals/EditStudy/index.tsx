// Externals
import {
  FC,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useEffect,
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { EditStudyModalContext } from '@/contexts/EditStudyModalContext'
import { EditStudyModalContextType, SessionContextType } from '@/contexts/types'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import modalStyles from '@/components/Modals/Modal.module.css'
import mainPortalStyle from '@/sections/main-portal/MainPortal.module.css'
import createStudyStyle from '@/sections/main-portal/studies/create/CreateStudy.module.css'



type EditStudyModalProps = {
  isModalVisible: string | null
  study: STUDY__DYNAMODB | null
  ref: React.RefObject<HTMLDivElement>
  setStudy: Dispatch<SetStateAction<STUDY__DYNAMODB | null>>
}




const EditStudyModal: FC<EditStudyModalProps> = ({
  ref,
  study,
  setStudy,
  isModalVisible,
}) => {
  // Refs
  const notificationRef = useRef<HTMLDivElement | null>(null)
  // Contexts
  const {
    setShowEditStudyModal
  } = useContext<EditStudyModalContextType>(EditStudyModalContext)
  const { 
    email
  } = useContext<SessionContextType>(SessionContext)
  // States
  const [
    description,
    setDescription
  ] = useState(study?.details.description ?? '')
  const [
    adminEmails,
    setAdminEmails
  ] = useState(study?.adminEmails?.join(', ') || '')
  const [ name, setName ] = useState(study?.name ?? '')
  const [ isUpdatingStudy, setIsUpdatingStudy ] = useState<boolean>(false)
  const [ showNotification, setShowNotification ] = useState<boolean>(false)
  const [ hideNotification, setHideNotification ] = useState<boolean>(false)

  
  const title = `Edit Study`
  const refClassName = `${modalStyles.modal} ${modalStyles.background} ${createStudyStyle['form-container']}`



  function closeModal(e: any) {
    return setShowEditStudyModal
      ? setShowEditStudyModal(null)
      : null
  }


  function handleCloseNotification () {
    setHideNotification(true)
  }



  async function handleSaveChanges(e: any) {
    const storedStudy = study as STUDY__DYNAMODB
    const updatedAdminEmails = adminEmails.split(',').map(email => email.trim())
    const updatedStudy: STUDY__DYNAMODB = {
      ...storedStudy,
      name,
      details: {
        ...storedStudy.details,
        description,
      },
      adminEmails: updatedAdminEmails,
    }

    await updateItemInDynamoDB(updatedStudy)
  }


  async function updateItemInDynamoDB(study: STUDY__DYNAMODB) {
    try {
      const response = await fetch('/api/study', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ study }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const message = json.message
        
        setIsUpdatingStudy(false)
        setShowEditStudyModal !== null ? setShowEditStudyModal(null) : null
        setShowNotification(true)

        return message
      } else {
        setIsUpdatingStudy(false)

        const error = `Error posting study '${study.name}' to DynamoDB: `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      setIsUpdatingStudy(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)

    }
  }




  useEffect(() => {
    if (hideNotification && notificationRef.current) {
      const timer = setTimeout(() => {
        setShowNotification(false)
        setHideNotification(false)
      }, 300) // Duration of the slideOut animation
      
      return () => clearTimeout(timer)
    }
  }, [ hideNotification ])





  return (
    <>
      <div 
        style={{
          ...definitelyCenteredStyle,
          position: 'absolute',
          top: '0px',
          right: '8px',
        }}
      >
        { showNotification && (
          <div 
            className={ mainPortalStyle['notification-card'] }
            style={{ 
              ...definitelyCenteredStyle, 
              flexDirection: 'row',
              padding: '14px',
            }}
          >
            <p>
              { `Saved changes successfully!` }
            </p>
            <button
              onClick={ () => setShowNotification(false) }
              className={ mainPortalStyle['close-button'] }
              style={ {
                position: 'relative',
                top: '-1px',
                right: '3px',
                fontSize: '16px',
                color: '#155724',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '12px',
                padding: '0px',
              } }
            >
              &times;
            </button>
          </div>
        )}
      </div>

      { isModalVisible === study?.id && (
        <>
          <div style={ definitelyCenteredStyle }>
            <div
              ref={ ref }
              className={ refClassName }
              style={ { width: 'max-content', maxWidth: '500px' } }
            >
              <div>
                <button
                  onClick={ closeModal }
                  className={ mainPortalStyle['close-button'] }
                  style={ {
                    top: '8px',
                    right: '10px',
                  } }
                >
                  &times;
                </button>
                <h3
                  style={ {
                    ...definitelyCenteredStyle,
                    margin: '0px 0px 0px 0px',
                  } }
                >
                  { title }
                </h3>
              </div>

              <div>
                <div className={ appStyles.field }>
                  <label htmlFor='name'>
                    { `Name:` }
                  </label>
                  <input
                    id='name'
                    type='text'
                    value={ name }
                    onChange={ e => setName(e.target.value) }
                  />
                </div>
                <div className={ appStyles.field }>
                  <label htmlFor='description'>
                    { `Description:` }
                  </label>
                  <textarea
                    id='description'
                    value={ description }
                    onChange={ e => setDescription(e.target.value) }
                  />
                </div>
                <div className={ appStyles.field }>
                  <label htmlFor='adminEmails'>
                    { `Admin Emails (comma separated):` }
                  </label>
                  <input
                    type='text'
                    id='adminEmails'
                    value={ adminEmails }
                    onChange={ e => setAdminEmails(e.target.value) }
                  />
                </div>

                { isUpdatingStudy ? (
                  <>
                    <div
                      style={ {
                        ...definitelyCenteredStyle,
                        position: 'relative',
                      } }
                    >
                      <Spinner height='40' width='40' />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={ { display: 'flex', gap: '8px' } }>
                      <button
                        onClick={ closeModal }
                        className={ appStyles.button }
                        style={ { backgroundColor: 'rgba(114, 114, 114, 0.75)' } }
                      >
                        { `Cancel` }
                      </button>
                      <button
                        onClick={ handleSaveChanges }
                        className={ appStyles.button }
                      >
                        { `Save` }
                      </button>
                    </div>
                  </>
                ) }
              </div>
            </div>
          </div>
        </>
      ) }
    </>
  )
}


export default EditStudyModal
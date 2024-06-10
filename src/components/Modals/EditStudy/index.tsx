// Externals
import {
  FC,
  useRef,
  useState,
  Dispatch,
  useEffect,
  useContext,
  SetStateAction,
  useLayoutEffect,
  useMemo,
  CSSProperties,
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { EditStudyModalContextType } from '@/contexts/types'
import { EditStudyModalContext } from '@/contexts/EditStudyModalContext'
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
  // Contexts
  const {
    setShowEditStudyModal
  } = useContext<EditStudyModalContextType>(EditStudyModalContext)
  // States
  // Strings
  const [ name, setName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ adminEmails, setAdminEmails ] = useState('')
  const [ invalidEmailMessage, setInvalidEmailMessage ] = useState<string>('')
  // Booleans
  const [ isSaveDisabled, setIsSaveDisabled ] = useState<boolean>(true)
  const [ isDefaultStudy, setIsDefaultStudy ] = useState<boolean>(true)
  const [ isUpdatingStudy, setIsUpdatingStudy ] = useState<boolean>(false)
  const [ showNotification, setShowNotification ] = useState<boolean>(false)
  const [ hideNotification, setHideNotification ] = useState<boolean>(false)

  
  const title = `Edit Study`
  const refClassName: string = `${modalStyles.modal} ${modalStyles.background} ${createStudyStyle['form-container']}`


  const saveButtonStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      backgroundColor: isSaveDisabled
        ? 'rgba(114, 114, 114, 0.35)'
        : '',
      borderRadius: `1rem`,
      borderWidth: `1.2px`,
      height: `35px`,
      width: `100%`,
      fontSize: `14px`,
      color: `rgb(244, 244, 244)`,
      boxShadow: isSaveDisabled ? 'none' : '',
    } 

    return style
  }, [ isSaveDisabled ])


  // -------------------------- Regular functions ------------------------------
  const handleOnNameChange = (e) => {
    setName(e.target.value)
    setIsDefaultStudy(false)
  }
  
  const handleOnDescriptionChange = (e) => {
    setDescription(e.target.value)
    setIsDefaultStudy(false)
  }
  
  const handleOnAdminEmailsChange = (e) => {
    setAdminEmails(e.target.value)
    setIsDefaultStudy(false)
    setInvalidEmailMessage('')
  }

  function closeModal(e: any) {
    return setShowEditStudyModal
      ? setShowEditStudyModal(null)
      : null
  }


  function handleCloseNotification () {
    setHideNotification(true)
  }


  // ---------------------------- Async functions ------------------------------
  async function handleSaveChanges(e: any) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    const emails = adminEmails.split(',').map(email => email.trim())
    
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        setInvalidEmailMessage('Please enter a valid email address')
        return
      }
    }

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

    // await updateItemInDynamoDB(updatedStudy)
    setIsUpdatingStudy(false)
    setShowEditStudyModal !== null ? setShowEditStudyModal(null) : null
    setShowNotification(true)
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


  // ------------------------------ `useEffect`s -------------------------------
  useEffect(() => {
    if (isModalVisible) {
      if (
        isDefaultStudy ||
        (
          name === study?.name &&
          description === study?.details.description &&
          adminEmails === study?.adminEmails?.join(', ')
        )
      ) {
        setIsSaveDisabled(true)
      } else {
        setIsSaveDisabled(false)
      }
    }
  }, [ 
    name, 
    study,
    description, 
    adminEmails, 
    isModalVisible, 
    isDefaultStudy, 
  ])


  useEffect(() => {
    if (hideNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
        setHideNotification(false)
      }, 300) // Duration of the slideOut animation
      
      return () => clearTimeout(timer)
    }
  }, [ hideNotification ])


  // ------------------------- `useLayoutEffect`s ------------------------------
  // This `useLayoutEffect()` is required because `study` is updated after the 
  // `user` has been detected with Auth0
  useLayoutEffect(() => {
    if (isModalVisible) {
      if (study && study.adminEmails)  {
        setIsDefaultStudy(true)

        setName(study?.name)
        setDescription(study?.details.description)
        setAdminEmails(study?.adminEmails?.join(', '))
      }
    }
  }, [ study, isModalVisible ])





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
                    onChange={ (e) => handleOnNameChange }
                  />
                </div>
                <div className={ appStyles.field }>
                  <label htmlFor='description'>
                    { `Description:` }
                  </label>
                  <textarea
                    id='description'
                    value={ description }
                    onChange={ 
                      (e) => handleOnDescriptionChange 
                    }
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
                    onChange={ (e) => handleOnAdminEmailsChange(e) }
                  />
                </div>
                
                { invalidEmailMessage && (
                  <p 
                    style={{ 
                      ...definitelyCenteredStyle,
                      color: 'red', 
                      margin: '-8px 0px 12px 0px',
                      fontSize: '12px',
                    }}
                  >
                    { invalidEmailMessage }
                  </p>
                )}

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
                        style={ saveButtonStyle }
                        disabled={ isSaveDisabled }
                        onClick={ handleSaveChanges }
                        className={ isSaveDisabled ? '' :  appStyles.button }
                      >
                        { `Save` }
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) }
    </>
  )
}


export default EditStudyModal
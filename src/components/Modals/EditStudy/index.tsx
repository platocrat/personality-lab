// Externals
import { 
  FC, 
  useState,
  Dispatch, 
  SetStateAction, 
} from 'react'
// Locals
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import modalStyles from '@/components/Modals/Modal.module.css'
import formStyles from '@/sections/main-portal/studies/create/CreateStudy.module.css'



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
  // States
  const [
    description, 
    setDescription
  ] = useState(study?.details.description ?? '')
  const [
    adminEmails, 
    setAdminEmails
  ] = useState(study?.adminEmails?.join(', ') || '')
  const [ name, setName] = useState(study?.name ?? '')

  console.log(`study?.id: `, study?.id)
  console.log(`isModalVisible: `, isModalVisible)


  const title = `Edit Study`
  const refClassName = `${modalStyles.modal} ${modalStyles.background} ${formStyles['form-container']}`


  const handleSaveChanges = () => {
    const updatedAdminEmails = adminEmails.split(',').map(email => email.trim())
    setStudy((prevStudy: any) => ({
      ...prevStudy,
      name,
      details: {
        ...prevStudy.details,
        description,
      },
      adminEmails: updatedAdminEmails,
    }))
  }




  return (
    <>
      { isModalVisible === study?.id && (
        <>
          <div style={ definitelyCenteredStyle }>
            <div
              ref={ ref }
              className={ refClassName }
            >
              <h3
                style={{
                  ...definitelyCenteredStyle,
                  margin: '8px 0px 24px 0px',
                }}
              >
                { title }
              </h3>

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
                  <label htmlFor='description'>Description:</label>
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
                <button 
                  onClick={ handleSaveChanges }
                  className={ appStyles.button }
                >
                  { `Save` }
                </button>
              </div>
            </div>
          </div>
        </>
      ) }
    </>
  )
}

export default EditStudyModal

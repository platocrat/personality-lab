'use client'

import { 
  FC, 
  Fragment, 
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
// Locals
import CreateStudyForm from './form'
import Spinner from '@/components/Suspense/Spinner'
// Utils
import { 
  AVAILABLE_ASSESSMENTS,
  STUDY__DYNAMODB, 
  getUsernameAndEmailFromCookie,
} from '@/utils'
// CSS
import sectionStyles from './CreateStudy.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type CreateStudyProps = {

}



const VIEW_STUDIES_HREF = '/view-studies'




const CreateStudy: FC<CreateStudyProps> = ({

}) => {
  // Hooks
  const router = useRouter()
  // States
  const [ study, setStudy ] = useState<STUDY__DYNAMODB>({
    id: '',
    name: '',
    timestamp: 0,
    ownerEmail: '',
    isActive: false,
    adminEmails: [],
    participants: [],
    details: {
      description: '',
      assessmentId: '',
      allowedSubmissionsPerParticipant: 1,
    },
  })
  const [ 
    invalidEmailMessage, 
    setInvalidEmailMessage 
  ] = useState<string | null>(null)
  const [ newAdminEmail, setNewAdminEmail ] = useState('')
  const [ newStudyCreated, setNewStudyCreated ] = useState<boolean>(false)
  const [ isCreatingStudy, setIsCreatingStudy ] = useState<boolean>(false)



  // ---------------------------- Regular functions ----------------------------
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target


    if (name === 'assessmentId') {
      setStudy((prevData) => ({
        ...prevData,
        details: {
          ...prevData.details,
          assessmentId: value,
        },
      }))
    } else if (name in study.details) {
      setStudy((prevData) => ({
        ...prevData,
        details: {
          ...prevData.details,
          [name]: type === 'number' ? Number(value) : value,
        },
      }))
    } else {
      setStudy((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }


  const handleAdminEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAdminEmail(e.target.value)
  }


  const addAdminEmail = () => {
    if (newAdminEmail && /\S+@\S+\.\S+/.test(newAdminEmail)) {
      setStudy((prevData) => ({
        ...prevData,
        adminEmails: [...prevData.adminEmails, newAdminEmail],
      }))
      setNewAdminEmail('')
      setInvalidEmailMessage(null)
    } else {
      setInvalidEmailMessage('Please enter a valid email address')
    }
  }


  const removeAdminEmail = (email: string) => {
    setStudy((prevData) => ({
      ...prevData,
      adminEmails: prevData.adminEmails.filter((e) => e !== email),
    }))
  }


  // ---------------------------- Async functions ------------------------------
  async function handleCreateStudy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsCreatingStudy(true)

    await storeStudyInDynamoDB()

    router.push(VIEW_STUDIES_HREF)

    setIsCreatingStudy(false)
  }


  async function storeStudyInDynamoDB() {
    const { email, username } = await getUsernameAndEmailFromCookie()


    if (email === undefined) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error getting email from cookie!`)
    } else {
      /**
       * @dev This is the object that we store in DynamoDB using AWS's 
       * `PutItemCommand` operation.
       */
      const study_: STUDY__DYNAMODB = {
        ...study,
        isActive: true,
        ownerEmail: email,
        adminEmails: [...study.adminEmails],
      }


      try {
        const response = await fetch('/api/study', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ study: study_ }),
        })

        const json = await response.json()

        if (response.status === 200) {
          const studyId = json.studyId
          return studyId
        } else {
          setIsCreatingStudy(false)

          const error = `Error posting study '${study.name}' to DynamoDB: `
          /**
           * @todo Handle error UI here
           */
          throw new Error(error, json.error)
        }
      } catch (error: any) {
        setIsCreatingStudy(false)

        /**
         * @todo Handle error UI here
         */
        throw new Error(`Error! `, error)

      }
    }
  }





  return (
    <>
      <div className={ `${sectionStyles['form-container']} ` }>
        <div style={{ ...definitelyCenteredStyle, marginBottom: '12px' }}>
          <h3>{ `Create a new study` }</h3>
        </div>
        
        <CreateStudyForm 
          study={ study }
          onSubmit={ handleCreateStudy }
          states={{
            newAdminEmail,
            isCreatingStudy,
            newStudyCreated,
            invalidEmailMessage,
          }}
          onClickHandlers={{
            addAdminEmail,
            removeAdminEmail
          }}
          onChangeHandlers={{
            handleChange,
            handleAdminEmailChange,
          }}
        />
      </div>
    </>
  )
}


export default CreateStudy
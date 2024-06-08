'use client'

import {
  FC,
  useLayoutEffect,
  useState,
} from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { usePathname, useRouter } from 'next/navigation'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import CreateStudyForm from '@/sections/main-portal/studies/create/form'
// Utils
import {
  STUDY__DYNAMODB,
} from '@/utils'
// CSS
import sectionStyles from './CreateStudy.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type CreateStudyProps = {

}




const CreateStudy: FC<CreateStudyProps> = ({

}) => {
  // Contexts
  const { user, error, isLoading } = useUser()
  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  // States
  const [ study, setStudy ] = useState<STUDY__DYNAMODB>({
    id: '',
    name: '',
    ownerEmail: '',
    isActive: false,
    adminEmails: [],
    participants: [],
    details: {
      inviteUrl: '',
      description: '',
      assessmentId: '',
    },
    createdAtTimestamp: 0,
    updatedAtTimestamp: 0,
  })
  const [ 
    invalidEmailMessage, 
    setInvalidEmailMessage 
  ] = useState<string | null>(null)
  const [ newAdminEmail, setNewAdminEmail ] = useState('')
  const [ inviteLink, setInviteLink ] = useState<string | null>(null)
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
        adminEmails: prevData.adminEmails
          ? [ ...prevData.adminEmails, newAdminEmail ] 
          : [ newAdminEmail ],
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
      adminEmails: prevData.adminEmails?.filter((e) => e !== email),
    }))
  }


  // ---------------------------- Async functions ------------------------------
  async function handleCreateStudy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsCreatingStudy(true)
    const studyId = await storeStudyInDynamoDB()
    setIsCreatingStudy(false)
    // Generate invite link URL
    let inviteLinkURL

    if (window !== undefined) {
      inviteLinkURL = `${ window.location.origin }/invite/${ studyId }`
    }

    setInviteLink(inviteLinkURL)
  }


  async function storeStudyInDynamoDB() {
    /**
     * @dev This is the object that we store in DynamoDB using AWS's 
     * `PutItemCommand` operation.
     */
    const study_: STUDY__DYNAMODB = {
      ...study,
      isActive: true,
      ownerEmail: user?.email ?? '',
      adminEmails: study ? study.adminEmails : [ '' ],
    }
    
    try {
      const response = await fetch('/api/study', {
        method: 'PUT',
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

        const error = `Error putting study '${study.name}' to DynamoDB: `
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

  
  useLayoutEffect(() => {
    if (!isLoading && user && user.email) {
      // Do nothing if Auth0 found the user's email
    } else if (!isLoading && !user) {
      // Silently log the error to the browser's console
      console.error(
        `Auth0 couldn't get 'user' from useUser(): `,
        error
      )
    }
  }, [ isLoading ])





  return (
    <>
      { isLoading ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '80px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>  
          <div className={ sectionStyles['form-container'] }>
            {/* Display invite link */ }
            { inviteLink ? (
              <>
                <div style={ { ...definitelyCenteredStyle, marginBottom: '24px' } }>
                  <h3>{ `Your study was created!` }</h3>
                </div>

                <div>
                  <p style={ { marginBottom: '8px' } }>
                    { `Here's your invite link:` }
                  </p>
                  <input
                    type='text'
                    value={ inviteLink }
                    readOnly
                    onClick={ (e) => {
                      e.preventDefault()
                      e.currentTarget.select()
                    } }
                  />
                </div>
              </>
            ) : (
              <>
                <div style={ { ...definitelyCenteredStyle, marginBottom: '12px' } }>
                  <h3>{ `Create a new study` }</h3>
                </div>

                <CreateStudyForm
                  study={ study }
                  onSubmit={ handleCreateStudy }
                  states={ {
                    newAdminEmail,
                    isCreatingStudy,
                    newStudyCreated,
                    invalidEmailMessage,
                  } }
                  onClickHandlers={ {
                    addAdminEmail,
                    removeAdminEmail
                  } }
                  onChangeHandlers={ {
                    handleChange,
                    handleAdminEmailChange,
                  } }
                />
              </>
            ) }
          </div>
        </>
      )}
    </>
  )
}


export default CreateStudy
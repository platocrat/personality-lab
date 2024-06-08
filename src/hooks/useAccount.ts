// Externals
import { useState, useCallback, useLayoutEffect } from 'react'
// Locals
import { 
  ACCOUNT__DYNAMODB, 
  PARTICIPANT__DYNAMODB, 
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'




function useAccount() {
  // Customs
  const [
    participant, 
    setParticipant,
  ] = useState<PARTICIPANT__DYNAMODB | undefined>(undefined)
  const [
    userStudies,
    setUserStudies,
  ] = useState<STUDY_SIMPLE__DYNAMODB[] | undefined>(undefined)
  // Strings
  const [accountError, setAccountError] = useState<string>('')
  // Booleans
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isParticipant, setIsParticipant] = useState<boolean>(false)
  const [isFetchingAccount, setIsFetchingAccount] = useState<boolean>(true)


  async function getAccount(): Promise<void> {
    try {
      const apiEndpoint = `/api/account`
      const response = await fetch(apiEndpoint, { method: 'GET' })

      const json = await response.json()

      if (response.status === 400) throw new Error(json.error)
      if (response.status === 404) throw new Error(json.message)
      if (response.status === 500) throw new Error(json.error)

      const account: ACCOUNT__DYNAMODB = json.account

      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/hooks/useAccount.ts" --function="fetchAccountStatus()"]: account`,
        account
      )
      
      const isAdmin_ = account.isAdmin
      const participant = account.participant
      const isParticiapnt_ = participant ? true : false
      const studies = participant?.studies as STUDY_SIMPLE__DYNAMODB[] | undefined

      setParticipant(participant)
      setIsParticipant(isParticiapnt_)
      setIsAdmin(isAdmin_)
      setUserStudies(studies)
    } catch (error: any) {
      setAccountError(error.message)
    } finally {
      setIsFetchingAccount(false)
    }
  }

  
  useLayoutEffect(() => {
    const requests = [
      getAccount(),
    ]

    Promise.all(requests)
  }, [])




  return { 
    isAdmin, 
    userStudies, 
    participant,
    accountError,
    isParticipant, 
    isFetchingAccount, 
  }
}

export default useAccount
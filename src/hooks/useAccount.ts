// Externals
import { useState, useCallback, useEffect } from 'react'
// Locals
import { 
  ACCOUNT__DYNAMODB, 
  PARTICIPANT__DYNAMODB, 
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'


type UseAccountType = {
  isAdmin: boolean
  accountError: string
  isParticipant: boolean
  isFetchingAccount: boolean
  participant: PARTICIPANT__DYNAMODB
  userStudies: STUDY_SIMPLE__DYNAMODB
}



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
  const [isFetchingAccount, setIsFetchingAccount] = useState<boolean>(false)


  async function getAccount(): Promise<void> {
    setIsFetchingAccount(true)

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

      setParticipant(account.participant)
      setIsParticipant(participant ? true : false)
      setIsAdmin(account.isAdmin)
      setUserStudies(participant?.studies as STUDY_SIMPLE__DYNAMODB[] | undefined)
    } catch (error: any) {
      setAccountError(error.message)
    } finally {
      setIsFetchingAccount(false)
    }
  }

  
  useEffect(() => {
    getAccount()
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
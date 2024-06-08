// Externals
import { useState, useCallback } from 'react'
// Locals
import { 
  ACCOUNT__DYNAMODB, 
  PARTICIPANT__DYNAMODB, 
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'


const useAccount = () => {
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
  const [acccountError, setAccountError] = useState<string>('')
  // Booleans
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isParticipant, setIsParticipant] = useState<boolean>(false)
  const [isFetchingAccount, setIsFetchingAccount] = useState<boolean>(false)


  const getAccount = useCallback(async () => {
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
      
      const participant = account.participant
      const isParticiapnt_ = participant ? true : false
      const isAdmin_ = account.isAdmin
      const studies = participant?.studies as STUDY_SIMPLE__DYNAMODB[] | undefined

      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/hooks/useAccount.ts" --function="fetchAccountStatus()"]: participant`, 
        participant
      )
      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/hooks/useAccount.ts" --function="fetchAccountStatus()"]: isParticiapnt_`, 
        isParticiapnt_
      )
      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/hooks/useAccount.ts" --function="fetchAccountStatus()"]: isAdmin_`, 
        isAdmin_
      )
      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/hooks/useAccount.ts" --function="fetchAccountStatus()"]: studies`, 
        studies
      )

      setParticipant(participant)
      setIsParticipant(isParticiapnt_)
      setIsAdmin(isAdmin_)
      setUserStudies(studies)
    } catch (error: any) {
      setAccountError(error.message)
    } finally {
      setIsFetchingAccount(false)
    }
  }, [])



  return { 
    isAdmin, 
    getAccount,
    userStudies, 
    participant,
    isParticipant, 
    isFetchingAccount, 
  }
}

export default useAccount
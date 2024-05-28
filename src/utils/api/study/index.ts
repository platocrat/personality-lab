// Externals
import { 
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateCommandInput, 
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest } from 'next/server'
// Locals 
import { getEntryId } from '../general'
import { 
  ddbDocClient,
  STUDY__DYNAMODB, 
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
} from '@/utils'




// Function to extract participant data from request
export async function extractParticipantData(
  req: NextRequest
): Promise<{ participantData: PARTICIPANT__DYNAMODB, studyId: string }> {
  const { participant, studyId } = await req.json()

  const participantId: string = await getEntryId(participant)

  const participantData: PARTICIPANT__DYNAMODB = {
    id: participantId,
    email: participant.email,
    username: participant.username,
    studies: participant.studies,
    adminEmail: participant.adminEmail,
    adminUsername: participant.adminUsername,
    isNobelLaureate: participant.isNobelLaureate,
    timestamp: Date.now(),
  }

  return { participantData, studyId }
}



// Function to fetch the participant's account entry from the accounts table
export async function fetchAccountEntry(
  participantEmail: string
): Promise<QueryCommandOutput> {
  const input: QueryCommandInput = {
    TableName: DYNAMODB_TABLE_NAMES.accounts,
    KeyConditionExpression: 'email = :emailValue',
    ExpressionAttributeValues: { ':emailValue': participantEmail },
  }

  const command = new QueryCommand(input)
  return await ddbDocClient.send(command)
}



// Function to update the account entry
export async function updateAccountEntry(
  participant: PARTICIPANT__DYNAMODB,
  accounEntry: ACCOUNT__DYNAMODB,
): Promise<UpdateCommandOutput> {
  const storedCreatedAtTimestamp = accounEntry.createdAtTimestamp
  const storedStudies = accounEntry.studies

  const updatedStudies = storedStudies 
    ? [ ...storedStudies, participant.studies[0] ] 
    : [ participant.studies[0] ]

  const participantWithUpdatedStudies = {
    ...participant,
    studies: updatedStudies,
    timestamp: Date.now(),
  }

  // console.log('\n\n HERE\n\n\n')

  const input: UpdateCommandInput = {
    TableName: DYNAMODB_TABLE_NAMES.accounts,
    Key: { 
      email: participant.email, 
      timestamp: storedCreatedAtTimestamp 
    },
    UpdateExpression: 'set participant = :participant, #ts = :timestamp',
    ExpressionAttributeNames: { '#ts': 'timestamp' },
    ExpressionAttributeValues: { 
      ':participant': participantWithUpdatedStudies, 
      ':timestamp': Date.now() 
    },
  }

  const command = new UpdateCommand(input)
  return await ddbDocClient.send(command)
}



// Function to fetch the study entry using study ID
export async function fetchStudyEntry(
  studyId: string
): Promise<QueryCommandOutput> {
  const input: QueryCommandInput = {
    TableName: DYNAMODB_TABLE_NAMES.studies,
    IndexName: 'id-index',
    KeyConditionExpression: 'id = :idValue',
    ExpressionAttributeValues: { ':idValue': studyId },
  }

  const command = new QueryCommand(input)
  return await ddbDocClient.send(command)
}



// Function to update the study entry
export async function updateStudyEntry(
  studyId: string, 
  participant: PARTICIPANT__DYNAMODB, 
  studyEntry: STUDY__DYNAMODB,
): Promise<UpdateCommandOutput> {
  const timestamp = studyEntry.timestamp
  const ownerEmail = studyEntry.ownerEmail
  const previousParticipants = studyEntry.participants
  
  const updatedParticipants = previousParticipants 
    ? [ ...previousParticipants, participant ] 
    : [ participant ]

  const input: UpdateCommandInput = {
    TableName: DYNAMODB_TABLE_NAMES.studies,
    Key: { ownerEmail, timestamp },
    UpdateExpression: 'set participants = :participants',
    ExpressionAttributeValues: { ':participants': updatedParticipants },
  }

  const command = new UpdateCommand(input)
  return await ddbDocClient.send(command)
}
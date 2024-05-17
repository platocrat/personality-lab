// Externals
import { NextResponse } from 'next/server'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient, DYNAMODB_TABLE_NAMES } from '@/utils/aws'

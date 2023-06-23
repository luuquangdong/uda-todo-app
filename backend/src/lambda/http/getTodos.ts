import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors'

import { getTodosBL } from '../../helpers/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const userId = getUserId(event)
    const size = parseInt(event["queryStringParameters"]['size']) || 10
    const filter = event["queryStringParameters"]['filter']
    let startKey = event["queryStringParameters"]['lastKey']
    if(startKey){
      startKey = JSON.parse(decodeURIComponent(startKey))
    }

    const result = await getTodosBL(userId, size, filter, startKey)

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

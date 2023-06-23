import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { createLogger } from '../../utils/logger'
import { generateUploadUrlBL } from '../../helpers/todos'
import { getUserId } from '../utils'

const logger = createLogger('HTTP_PresignedUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info(`Get presigned URL for TODO id ${todoId}`)

    const { presignedUrl, imageUrl } = await generateUploadUrlBL(userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: presignedUrl,
        imageUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

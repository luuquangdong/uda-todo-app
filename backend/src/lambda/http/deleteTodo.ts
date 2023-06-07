import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { createLogger } from '../../utils/logger'
import { deleteTodoBL } from '../../helpers/todos'
import { getUserId } from '../utils'

const logger = createLogger('HTTP_DeleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    // TODO: Remove a TODO item by id
    logger.info(`Remove a TODO item by id ${todoId}`)
    
    try {
      await deleteTodoBL(userId, todoId)
    } catch (err) {
      if(err.message === 'TODO_NOT_FOUND') {
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: 'Todo does not exist'
          })
        }
      }

      if(err.message === 'CANT_DELETE_TODO') {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Server error'
          })
        }
      }
    }
    
    return {
      statusCode: 204,
      body: null
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

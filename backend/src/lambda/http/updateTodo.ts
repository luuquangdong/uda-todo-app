import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { updateTodoBLL, todoExists } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('HTTP_UpdateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    logger.info(`Update TODO ${todoId}: ${event.body}`)

    if(!todoExists(userId, todoId)) {
      logger.info(`No TODO item has id ${todoId}`)
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Todo does not exist'
        })
      }
    }

    await updateTodoBLL(userId, todoId, updatedTodo)

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

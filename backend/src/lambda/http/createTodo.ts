import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodoBL } from '../../helpers/todos'

const logger = createLogger('HTTP_CreateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    logger.info(`Create todo: $${event.body}`)

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId: string = getUserId(event)

    const createdTodo = await createTodoBL(newTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: createdTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

import { getTodosByUserId, createTodo, updateTodo, deleteTodo, addAttachTodo, getTodoById, GetTodosResType } from './todosAcess'
import { getUploadUrl, deleteImageFromS3 } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('TodoBussinessLogic')

// TODO: Implement businessLogic
export async function getTodosBL(userId: string, size: number, filter: string, lastTodoKey: any) : Promise<GetTodosResType> {
  return await getTodosByUserId(userId, size, filter, lastTodoKey)
}

export async function createTodoBL(newTodo: CreateTodoRequest, userId: string) : Promise<TodoItem> {

  return await createTodo({
    ...newTodo,
    userId,
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: 0
  })
}

export async function deleteTodoBL(userId: string, todoId: string) {
  const todoItem: TodoItem = await getTodoById(userId, todoId)
  if(!todoItem) {
    throw Error('TODO_NOT_FOUND')
  }

  try{
    await deleteTodo(userId, todoId)
  } catch (err) {
    logger.error(JSON.stringify(err))
    throw Error('CANT_DELETE_TODO')
  }

  const imageId = getImageIdFromUrl(todoItem.attachmentUrl)
  if(!imageId) return;

  try {
    await deleteImageFromS3(imageId)
  } catch (err) {
    logger.error(JSON.stringify(err))
    throw Error('CANT_DELETE_IMAGE')
  }
}

export async function updateTodoBL(userId: string, todoId: string, todo: UpdateTodoRequest) {
  const todoItem: TodoItem = await getTodoById(userId, todoId)
  if(!todoItem) {
    throw Error('TODO_NOT_FOUND')
  }

  await updateTodo(userId, todoId, todo)
}

export async function generateUploadUrlBL(userId: string, todoId: string) : Promise<any> {
  const imageId = uuid.v4()

  const imageUrl = await addAttachTodo(userId, todoId, imageId)

  const presignedUrl = getUploadUrl(imageId)
  return { presignedUrl, imageUrl }
}

function getImageIdFromUrl(imageUrl: string): string {
  if(!imageUrl) 
    return null;
  
  const sections = imageUrl.split('/')
  
  if(sections.length != 4) 
    return null

  return sections[3]
}
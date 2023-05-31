import { getTodosByUserIdDAL, createTodoDAL, updateTodoDAL, deleteTodoDAL, addAttachTodoDAL, getTodoByIdDAL } from './todosAcess'
import { getUploadUrl } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
export async function getTodosBLL(userId: string) : Promise<TodoItem[]> {
  return await getTodosByUserIdDAL(userId)
}

export async function createTodoBLL(newTodo: CreateTodoRequest, userId: string) : Promise<TodoItem> {

  return await createTodoDAL({
    ...newTodo,
    userId,
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function deleteTodoBLL(userId: string, todoId: string) {
  await deleteTodoDAL(userId, todoId)
}

export async function updateTodoBLL(userId: string, todoId: string, todo: UpdateTodoRequest) {
  
  await updateTodoDAL(userId, todoId, todo)
}

export async function todoExists(userId: string, todoId: string) {
  const todoItem: TodoItem = await getTodoByIdDAL(userId, todoId)

  return !!todoItem
}

export async function generateUploadUrlBLL(userId: string, todoId: string) : Promise<string> {
  const imageId = uuid.v4()

  await addAttachTodoDAL(userId, todoId, imageId)

  const presignedUrl = getUploadUrl(imageId)
  return presignedUrl
}

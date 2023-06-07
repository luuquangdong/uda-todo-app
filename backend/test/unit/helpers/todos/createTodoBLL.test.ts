import { createTodoBL } from "../../../../src/helpers/todos";
import { CreateTodoRequest } from "../../../../src/requests/CreateTodoRequest";
import { TodoItem } from "../../../../src/models/TodoItem";

var mockFn: jest.Mock

jest.mock('../../../../src/helpers/todosAcess', () => ({
    createTodo: mockFn = jest.fn().mockImplementation((newTodo: TodoItem) => Promise.resolve(newTodo))
}))

describe('Test function createTodoBL', () => {
    test('should return Promise<TodoItem>', async () => {
        // Setup
        const userId = '001'
        const todoRequest: CreateTodoRequest = {
            name: 'Todo request',
            dueDate: '2023-06-13T15:58:32.369Z'
        }

        // Run
        const rs = await createTodoBL(todoRequest, userId)

        // Assert
        expect(rs).toBeDefined()
        expect(rs.userId).toBe(userId)
        expect(rs.todoId).toBeDefined()
        expect(rs.done).toBeFalsy()
        expect(mockFn).toHaveBeenCalledTimes(1)
    })
})
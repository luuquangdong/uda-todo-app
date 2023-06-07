import { updateTodoBL } from '../../../../src/helpers/todos'
import { UpdateTodoRequest } from '../../../../src/requests/UpdateTodoRequest';
import { todos } from './data.mock'

var mockUpdateTodo: jest.Mock;
var mockGetTodoById: jest.Mock;

jest.mock('../../../../src/helpers/todosAcess', () => ({
    updateTodo: mockUpdateTodo = jest.fn()
        .mockImplementation((userId: string, todoId: string, todo: UpdateTodoRequest) => Promise.resolve('ok')),
    getTodoById: mockGetTodoById = jest.fn()
        .mockImplementation((userId: string, todoId: string) => Promise.resolve(
            todos.find(t => (t.userId === userId && t.todoId === todoId))
        ))
}))

afterEach(() => {
    mockUpdateTodo.mockClear()
    mockGetTodoById.mockClear()
})

describe('Test function updateTodoBL', function() {
    test('update success', async () => {
        // Setup
        const todo = todos[0]
        const updateTodoReq: UpdateTodoRequest = {
            done: true,
            name: 'Mot',
            dueDate: '2023-06-13T15:58:32.369Z'
        }

        // Run
        await updateTodoBL(todo.userId, todo.todoId, updateTodoReq)

        // Assert
        expect(mockUpdateTodo).toHaveBeenCalledTimes(1)
    })

    test('update fail because todo not found', async () => {
        // Setup
        const userId = 'xxx'
        const totoId = 'xxx'
        const updateTodoReq: UpdateTodoRequest = {
            done: true,
            name: 'Mot',
            dueDate: '2023-06-13T15:58:32.369Z'
        }
        var error : (Error | undefined) = undefined
        
        // Run
        try {
            await updateTodoBL(userId, totoId, updateTodoReq)
        } catch (e) {
            error = e;
        }

        // Assert
        expect(error).toBeDefined()
        expect(error?.message).toBe('TODO_NOT_FOUND')
        expect(mockUpdateTodo).toHaveBeenCalledTimes(0)
    })
})
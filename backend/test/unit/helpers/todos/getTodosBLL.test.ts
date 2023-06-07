import { getTodosBL } from '../../../../src/helpers/todos'
import { todos } from './data.mock'

// const mockFn = jest.fn().mockImplementation((userId: string) => Promise.resolve(
//     todos.filter(todo => todo.userId === userId)
// ))

var mockGetTodosByUserId: jest.Mock;

jest.mock('../../../../src/helpers/todosAcess', () => {
    mockGetTodosByUserId = jest.fn().mockImplementation((userId: string) => Promise.resolve(
        todos.filter(todo => todo.userId === userId)
    ))
    
    return {
        getTodosByUserId: mockGetTodosByUserId
    }
})

afterEach(() => {
    mockGetTodosByUserId.mockClear()
})

describe('Test function getTodosBL', function() {
    test('should get 4 item with userId u01', async () => {
        // Setup
        const userId = 'u01'

        // Run
        const result = await getTodosBL('u01')

        // Assert
        expect(result.length).toBe(4)
        expect(mockGetTodosByUserId).toHaveBeenCalledTimes(1)
        result.forEach(todo => expect(todo.userId).toEqual(userId))
    })

    test('should get 0 item with userId u04', async () => {
        // Setup

        // Run
        const todosActual = await getTodosBL('u04')

        // Assert
        expect(mockGetTodosByUserId).toHaveBeenCalledTimes(1)
        expect(todosActual.length).toBe(0)
    })
})
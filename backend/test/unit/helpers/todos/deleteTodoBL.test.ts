import { deleteTodoBL } from "../../../../src/helpers/todos";

var mockGetTodoById: jest.Mock
var mockDeleteTodo: jest.Mock
var mockDeleteImageFromS3: jest.Mock

const defaultTodo = {
    todoId: 't01',
    userId: 'u01',
    name: 'One',
    createdAt: '2023-06-03T15:58:32.369Z',
    dueDate: '2023-06-13T15:58:32.369Z',
    done: false,
    attachmentUrl: 'http://fakeimage/imageId'
}

jest.mock('../../../../src/helpers/todosAcess', () => ({
    getTodoById: mockGetTodoById = jest.fn(),
    deleteTodo: mockDeleteTodo = jest.fn(),
}))

jest.mock('../../../../src/helpers/attachmentUtils', () => ({
    deleteImageFromS3: mockDeleteImageFromS3 = jest.fn()
}))

afterEach(() => {
    mockGetTodoById.mockReset()
    mockDeleteTodo.mockReset()
    mockDeleteImageFromS3.mockReset()
})


describe('Test function deleteTodoBL', () => {
    test('delete success without attachmentUrl', async () => {
        // Setup
        mockGetTodoById.mockImplementation((userId: string) => Promise.resolve({...defaultTodo, attachmentUrl: undefined}))
        mockDeleteTodo.mockImplementation((userId: string, todoId: string) => Promise.resolve())

        // Run
        await deleteTodoBL('uid', 'tid')

        // Assert
        expect(mockGetTodoById.mock.calls.length).toBe(1)
        expect(mockDeleteTodo.mock.calls.length).toBe(1)
        expect(mockDeleteImageFromS3.mock.calls.length).toBe(0)
    })

    test('delete success with correct attachmentUrl', async () => {
        // Setup
        mockGetTodoById.mockImplementation((userId: string) => Promise.resolve(defaultTodo))
        mockDeleteTodo.mockImplementation((userId: string, todoId: string) => Promise.resolve())
        mockDeleteImageFromS3.mockImplementation((imageId: string) => Promise.resolve())

        // Run
        await deleteTodoBL('uid', 'tid')

        // Assert
        expect(mockGetTodoById).toHaveBeenCalledTimes(1)
        expect(mockDeleteTodo).toHaveBeenCalledTimes(1)
        expect(mockDeleteImageFromS3).toHaveBeenCalledTimes(1)
    })

    test('delete success with wrong attachmentUrl', async () => {
        // Setup
        mockGetTodoById.mockImplementation((userId: string) => Promise.resolve({...defaultTodo}))
        mockDeleteTodo.mockImplementation((userId: string, todoId: string) => Promise.resolve())
        mockDeleteImageFromS3.mockImplementation((imageId: string) => Promise.reject('error'))

        var error : Error | undefined = undefined
        
        // Run
        try {
            await deleteTodoBL('uid', 'tid')
        } catch (e) {
            error = e
        }

        // Assert
        expect(mockGetTodoById).toHaveBeenCalledTimes(1)
        expect(mockDeleteTodo).toHaveBeenCalledTimes(1)
        expect(mockDeleteImageFromS3).toHaveBeenCalledTimes(1)
        expect(error).toBeDefined()
        expect(error?.message).toBe('CANT_DELETE_IMAGE')
    })
    
    test('delete fail because todo not exist in db', async () => {
        // Setup
        mockGetTodoById.mockImplementation((userId: string) => Promise.resolve(null))

        var error : Error | undefined = undefined

        // Run
        try{
            await deleteTodoBL('userId', 'todoId')
        } catch (e) {
            error = e
        }

        // Assert
        expect(mockGetTodoById).toHaveBeenCalledTimes(1)
        expect(mockDeleteTodo).toHaveBeenCalledTimes(0)
        expect(mockDeleteImageFromS3).toHaveBeenCalledTimes(0)
        expect(error).toBeDefined()
        expect(error?.message).toBe('TODO_NOT_FOUND')
    })
      
    test('delete fail because of error while deleting in db', async () => {
        // Setup
        mockGetTodoById.mockImplementation((userId: string) => Promise.resolve(defaultTodo))
        mockDeleteTodo.mockImplementation((userId: string, todoId: string) => Promise.reject('error'))

        var error : Error | undefined = undefined

        // Run
        try{
            await deleteTodoBL('uid', 'tid')
        } catch (e) {
            error = e
        }

        // Assert
        expect(mockGetTodoById).toHaveBeenCalledTimes(1)
        expect(mockDeleteTodo).toHaveBeenCalledTimes(1)
        expect(mockDeleteImageFromS3).toHaveBeenCalledTimes(0)
        expect(error).toBeDefined()
        expect(error?.message).toBe('CANT_DELETE_TODO')
    })  
})
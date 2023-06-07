import { TodoItem } from '../../../../src/models/TodoItem'

export const todos: TodoItem[] = [
    {
        todoId: 't01',
        userId: 'u01',
        name: 'One',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: false,
        attachmentUrl: undefined
    },
    {
        todoId: 't02',
        userId: 'u01',
        name: 'Two',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: true,
        attachmentUrl: 'fakeUrl'
    },
    {
        todoId: 't03',
        userId: 'u01',
        name: 'Three',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: false,
        attachmentUrl: 'error'
    },
    {
        todoId: 't04',
        userId: 'u01',
        name: 'Four',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: true,
        attachmentUrl: ''
    },
    {
        todoId: 't05',
        userId: 'u02',
        name: 'Five',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: false,
        attachmentUrl: ''
    },
    {
        todoId: 't06',
        userId: 'u02',
        name: 'Six',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: false,
        attachmentUrl: ''
    },
    {
        todoId: 't07',
        userId: 'u02',
        name: 'Seven',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: true,
        attachmentUrl: ''
    },
    {
        todoId: 't08',
        userId: 'u03',
        name: 'Eight',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: false,
        attachmentUrl: ''
    },
    {
        todoId: 't09',
        userId: 'u03',
        name: 'Nine',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: true,
        attachmentUrl: ''
    },
    {
        todoId: 'error',
        userId: 'error',
        name: 'Ten',
        createdAt: '2023-06-03T15:58:32.369Z',
        dueDate: '2023-06-13T15:58:32.369Z',
        done: false,
        attachmentUrl: ''
    }
]
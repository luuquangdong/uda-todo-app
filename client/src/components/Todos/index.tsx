import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader,
  Select
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../../api/todos-api'
import Auth from '../../auth/Auth'
import { Todo } from '../../types/Todo'
import { ActionsWrapper, Wrapper } from './styles'
import TodoItem from '../TodoItem'
import AddTodoModal from '../../containers/AddTodoModal'
import EditTodoModal from '../../containers/EditTodoModal'

const stateTodoOptions = [
  {
    key: 'all', 
    value: 'all', 
    text: 'All'
  },
  {
    key: 'todo', 
    value: 'todo', 
    text: 'Todo'
  },
  {
    key: 'done', 
    value: 'done', 
    text: 'Done'
  }
]

let fetchingData = false;
let observer: any = null;

const PAGE_SIZE = 5

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  loadingTodos: boolean
  openAddModal: boolean
  openEditModal: boolean
  selectedTodo?: Todo
  filter: any
  hasMore: boolean
  lastKey: any
}


export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    loadingTodos: false,
    openAddModal: false,
    openEditModal: false,
    selectedTodo: undefined,
    filter: 'all',
    hasMore: true,
    lastKey: null,
  }

  onAddModalOpen = () => {
    this.setState({openAddModal: true})
  }

  onAddModalClose = () => {
    this.setState({openAddModal: false})
  }
  
  onEditModalOpen = () => {
    this.setState({openEditModal: true})
  }

  onEditModalClose = () => {
    this.setState({openEditModal: false, selectedTodo: undefined})
  }

  handleEditClick = (todo: Todo) => {
    this.setState({
      openEditModal: true,
      selectedTodo: todo
    })
  }

  addTodo = (newTodo: Todo) => {
    if(this.state.filter === 'done')
      return
    
    this.setState({
      todos: [...this.state.todos, newTodo],
    })
  }

  updateTodo = (updatedTodo: Todo) => {
    const pos = this.state.todos.findIndex(todo => todo.todoId === updatedTodo.todoId)
    this.setState({
      todos: update(this.state.todos, {
        [pos]: {$set: updatedTodo}
      })
    })
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      const done = (todo.done + 1) % 2
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  callbackRef = (node: HTMLDivElement) => {
    if(observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        this.fetchMoreTodos()
      }
    }, {threshold: 0.5})

    if(node) {
      observer.observe(node)
    }
  }

  async fetchMoreTodos() {
    if(!this.state.hasMore) return;
    if(fetchingData) return;
    console.log('fetchMoreTodos')
    
    try {
      fetchingData = true;
      this.setState({loadingTodos: true})

      const {todos, lastKey} = await getTodos(this.props.auth.getIdToken(), PAGE_SIZE, this.state.filter, this.state.lastKey)
      
      if(todos.length === 0) {
        this.setState({hasMore: false, loadingTodos: false})
        fetchingData = false
        return;
      }
      
      if(todos.length < PAGE_SIZE) {
        fetchingData = false
        this.setState({
          todos: [...this.state.todos, ...todos],
          lastKey,
          loadingTodos: false,
          hasMore: false
        })
        return;
      }

      this.setState({
        todos: [...this.state.todos, ...todos],
        lastKey,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
      this.setState({hasMore: false, loadingTodos: false})
    }
    fetchingData = false;
  }

  async componentDidMount() {
    await this.fetchMoreTodos()
  }

  render() {
    return (
      <Wrapper>
        <Header as="h1">TODOs</Header>
        <Divider/>

        {this.renderActions()}

        {/* {this.renderCreateTodoInput()} */}

        {this.renderTodos()}
        <AddTodoModal
          open={this.state.openAddModal}
          onOpen={this.onAddModalOpen}
          onClose={this.onAddModalClose}
          idToken={this.props.auth.getIdToken()}
          addTodo={this.addTodo}
        />
        <EditTodoModal 
          open={this.state.openEditModal}
          onOpen={this.onEditModalOpen}
          onClose={this.onEditModalClose}
          idToken={this.props.auth.getIdToken()}
          updateTodo={this.updateTodo}
          todo={this.state.selectedTodo}
        />
      </Wrapper>
    )
  }

  renderActions(){
    return (
      <ActionsWrapper>
        <Select options={stateTodoOptions} value={this.state.filter} onChange={(_, data) => {
          this.setState({filter: data.value, todos: [], lastKey: null, hasMore: true}, () => this.fetchMoreTodos())
        }}/>
        <Button 
          icon 
          labelPosition='left' 
          primary
          onClick={this.onAddModalOpen}
        >
          <Icon name='add' />
          New Task 
        </Button>
      </ActionsWrapper>
    )
  }

  renderTodos() {

    return <>
      {this.renderTodosList()}
      {this.state.loadingTodos && this.renderLoading()}
    </>
    
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          if(pos + 1 === this.state.todos.length) {
            return (<TodoItem
              key={todo.todoId}
              todo={todo}
              onCheck={() => this.onTodoCheck(pos)}
              onDelete={() => this.onTodoDelete(todo.todoId)}
              onEdit={this.handleEditClick}
              callbackRef={this.callbackRef}
            />)
          } 
          return (<TodoItem
            key={todo.todoId}
            todo={todo}
            onCheck={() => this.onTodoCheck(pos)}
            onDelete={() => this.onTodoDelete(todo.todoId)}
            onEdit={this.handleEditClick}
          />)
        }
        )}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}

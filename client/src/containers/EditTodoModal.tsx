import TodoModal from "../components/TodoModal";
import { getUploadUrl, patchTodo, uploadFile } from "../api/todos-api";
import { Todo } from "../types/Todo";
import { UpdateTodoRequest } from "../types/UpdateTodoRequest";

type EditTodoModalProps = {
  open: boolean
  onOpen: () => void
  onClose: () => void
  updateTodo: (todo: Todo) => void
  idToken: string
  todo?: Todo
}

export default function EditTodoModal(props: EditTodoModalProps) {

  const handleSubmit = async (updateTodoReq: UpdateTodoRequest, file: any) => {
    const { idToken, todo } = props
    
    if(!todo) return
    
    await patchTodo(idToken, todo.todoId, updateTodoReq)
    if(!file) {
      props.updateTodo({...todo, ...updateTodoReq})
      return;
    }

    const res = await getUploadUrl(idToken, todo.todoId)
    try{
      await uploadFile(res.uploadUrl, file)
      todo.attachmentUrl = res.imageUrl
    } catch (e) {
      console.log(e)
    } finally {
      props.updateTodo({...todo, ...updateTodoReq})
    }

  }

  return <TodoModal 
    {...props}
    header="Update TODO"
    onSubmit={handleSubmit}
  />
}
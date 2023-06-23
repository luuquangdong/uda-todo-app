import { Button, Checkbox, Confirm, Icon, Image, Loader } from "semantic-ui-react";
import { ActionTop, Content, DueDate, Wrapper } from "./styles";
import { Todo } from "../../types/Todo";
import { useState } from "react";

type TodoItemProp = {
  todo: Todo,
  onCheck: () => Promise<void>,
  onDelete: () => Promise<void>,
  onEdit: (todo: Todo) => void,
  callbackRef?: (element: HTMLDivElement) => void
}

function TodoItem({todo, onCheck, onDelete, onEdit, callbackRef} : TodoItemProp){

  const [checking, setChecking] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)


  const handleCheck = async () => {
    setChecking(true)
    try {
      await onCheck()
    } catch(e) {
      console.log(e)
    } finally {
      setChecking(false)
    }
  }

  const handleConfirmClick = async () => {
    onDelete()
    setOpenConfirm(false)
  }

  return (
    <Wrapper ref={callbackRef}>
      <ActionTop>
        { checking 
          ? <Loader size="tiny" inline active/> 
          : <Checkbox checked={todo.done === 1} onChange={handleCheck}/>
        }
        <DueDate done={todo.done} dueDate={todo.dueDate}>{todo.dueDate}</DueDate>
        <Button
          icon
          color="blue"
          size="mini"
          onClick={() => onEdit(todo)}
        >
          <Icon name="pencil" />
        </Button>
        <Button
          icon
          color="red"
          size="mini"
          onClick={() => setOpenConfirm(true)}
        >
          <Icon name="delete" />
        </Button>
      </ActionTop>
      <Content>{todo.name}</Content>
      { todo.attachmentUrl && 
        <Image src={todo.attachmentUrl} wrapped />}
      <Confirm 
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleConfirmClick}
      />
    </Wrapper>
  )
}

export default TodoItem
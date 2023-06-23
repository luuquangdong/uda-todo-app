import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Image, Input, Modal } from "semantic-ui-react";
import { InputGroup, InputLabel } from "./styles";
import { Todo } from "../../types/Todo";

type TodoModalProps = {
  onOpen: () => void
  onClose: () => void
  onSubmit: (data: any, file: any) => Promise<any>
  open: boolean
  header: string
  todo?: Todo
}

export default function TodoModal(props: TodoModalProps){
 
  const {
    open, 
    onOpen, 
    onClose,
    onSubmit,
    header,
    todo
  } = props;
  
  const [task, setTask] = useState('')
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().substring(0, 10))
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files || e.target.files.length === 0) {
      setFile(undefined)
      return;
    }

    setFile(e.target.files[0])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try{
      const data : {name: string, dueDate: string, done?: number} = { name: task, dueDate }
      if(todo) {
        data.done = todo.done
      }

      await onSubmit(data, file)
    } catch (e) {
      console.log(e)
    } finally {
      setSubmitting(false)
    }
    onClose()
  }

  useEffect(() => {
    if(!file) return;

    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  useEffect(() => {
    if(open) return;

    setTask('')
    setDueDate(new Date().toISOString().substring(0, 10))

    if(previewImage) {
      URL.revokeObjectURL(previewImage)
      setPreviewImage(null)
    }
  }, [open])

  useEffect(() => {
    if(!todo) return;

    setTask(todo.name)
    setDueDate(todo.dueDate)
    if(todo.attachmentUrl) {
      setPreviewImage(todo.attachmentUrl)
    }
  }, [todo])

  return (
    <Modal 
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Modal.Header>{header}</Modal.Header>
      
      <Modal.Content>
        <InputGroup>
          <InputLabel>Task</InputLabel>
          <Input 
            placeholder="Enter task.."
            fluid
            value={task}
            onChange={e => setTask(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel>Due Date</InputLabel>
          <input 
            type="date" 
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel>Image</InputLabel>
          <input
            type="file"
            accept="image/*"
            placeholder="Image to upload"
            onChange={handleSelectedFile}
          />
        </InputGroup>
        {!!previewImage && <Image src={previewImage} wrapped/>}
      </Modal.Content>

      <Modal.Actions>
        <Button color='black' onClick={onClose}>
          Cancel
        </Button>
        <Button
          content="Submit"
          onClick={handleSubmit}
          positive
          loading={submitting}
          disabled={submitting}
        />
      </Modal.Actions>
    </Modal>
  )
}
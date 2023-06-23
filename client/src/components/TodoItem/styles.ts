import styled from "styled-components"

export const Wrapper = styled.div`
  border: 1px #EEE solid;
  border-radius: 12px;
  
  margin-bottom: 8px;
  padding: 16px 8px 18px;
  width: 100%;

  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
`

export const ActionTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px; 
`

type DueDateProps = {
  done: number
  dueDate: string
}
export const DueDate = styled.div<DueDateProps>`
  flex: 1;
  font-size: 0.9rem;
  color: ${({done, dueDate}) => {
    if(done === 1)
      return "green"
    if(new Date().toISOString().substring(0, 10).localeCompare(dueDate) > 0)
      return "red"
    return "#AAA"
  }};
  margin-left: 8px;
`

export const Content = styled.div`
  font-size: 1.2rem;
`
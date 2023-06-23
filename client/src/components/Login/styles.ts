import styled from "styled-components"

export const Wrapper = styled.div`
  height: 80vh;
  max-width: 400px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const Inner = styled.div`
  border: 1px #ddd solid;
  border-radius: 16px;
  padding: 20px;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

export const Title = styled.h1`
  margin-bottom: 48px;
`

export const Center = styled.div`
  display: flex;
  justify-content: center;
`
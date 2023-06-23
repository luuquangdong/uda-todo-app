import * as React from 'react'
import Auth from '../../auth/Auth'
import { Button } from 'semantic-ui-react'
import { Center, Inner, Title, Wrapper } from './styles'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <Wrapper>
        <Inner>
          <Title>Please log in</Title>

          <Center>
            <Button onClick={this.onLogin} size="huge" color="olive">
              Log in
            </Button>
          </Center>
        </Inner>
      </Wrapper>
    )
  }
}

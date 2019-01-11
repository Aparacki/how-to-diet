import {Button} from 'antd'
import {BaseButtonProps} from 'antd/lib/button/button'
import styled from 'styled-components'

export const StyledButton = styled(Button)<BaseButtonProps & React.HTMLProps<HTMLElement>>`
  margin-top: 30px;
  background: white;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.45);
`

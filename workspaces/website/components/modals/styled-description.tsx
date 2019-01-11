import {Button} from 'antd'
import {BaseButtonProps} from 'antd/lib/button/button.d'
import styled from 'styled-components'

export const RightButton = styled(Button)<BaseButtonProps & React.HTMLProps<HTMLElement>>`
  margin: 10px 0 0 10px;
  min-width: 120px;
  text-transform:uppercase;
`

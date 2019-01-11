import {Button} from 'antd'
// You have to import antd component's props interface
import {BaseButtonProps} from 'antd/lib/button/button'
import styled from 'styled-components'

const StyledButton = styled(Button)<BaseButtonProps & React.HTMLProps<HTMLElement>>`
  font-size: 11px;
`
export default StyledButton

import {Button} from 'antd'
import {Icon} from 'antd'
import {BaseButtonProps, NativeButtonProps} from 'antd/lib/button/button'
import {IconProps} from 'antd/lib/icon/index.d'
import styled from 'styled-components'

export const StyledButton = styled(Button)<BaseButtonProps & React.HTMLProps<HTMLElement>>`
  border: 0;
  box-shadow: none;
  padding: 0;
`

export const InviteButton = styled(Button)<NativeButtonProps & React.HTMLProps<HTMLElement>>`
  width: 100px;
  &:disabled {
    display: none;
  }
`

export const StyledIcon = styled(Icon)<IconProps & React.HTMLProps<HTMLElement>>`
  color: red;
`

export const Heading = styled.h2`
  font-weight: 500;
  line-height: 14px;
  font-size: 14px;
  margin: 30px 0;
`

export const Item = styled.div`
  border-bottom: 1px solid #E8E8E8;
  padding-bottom: 30px;
`

export const InvitedList = styled.div`
  overflow: auto;
`

export const InvitedListItem = styled.div`
  width: 100%;
  display: grid;
  margin-bottom: 15px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  white-space: nowrap;
  min-width: 350px;

  div {
    flex: 1;
  }
`

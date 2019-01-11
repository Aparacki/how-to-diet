import {NavLink} from 'react-router-dom'
import styled from 'styled-components'

export const Link = styled(NavLink)`
  margin-right: ${_ => _.theme.spacing.sm};
  color: #1890FF;
`

export const Download = Link.withComponent('a')

export const Delete = styled.button`
  background: none;
  border: 0;
  outline: none;
  color: ${_ => _.theme.colors.negative.hex};
`

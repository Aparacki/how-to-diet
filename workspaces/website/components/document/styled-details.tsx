import {Row} from 'antd'
import Col, {ColProps} from 'antd/lib/col'
import {RowProps} from 'antd/lib/row/index.d'
import styled from 'styled-components'

export const RowNoWrap = styled(Row)<RowProps & React.HTMLProps<HTMLElement>>`
  flex-flow: row;
  flex-wrap: nowrap !important;
`

export const ColFlex = styled(Col)<ColProps & React.HTMLProps<HTMLElement>>`
  display: flex;
  justify-content: flex-end;
`

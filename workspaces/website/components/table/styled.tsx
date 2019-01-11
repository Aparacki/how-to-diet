import {Table} from 'antd'
import {TableProps} from 'antd/lib/table'
import styled from 'styled-components'

export const DocumentsTable = styled(Table)<TableProps<any>>`
  margin-top: ${_ => _.theme.spacing.lg};
  .ant-table {
    overflow: auto;
  }
  .ant-table-content {
    white-space: nowrap;
  }

  tr > th {
    border: 0;

    div {
      font-weight: 300;
    }
  }
`

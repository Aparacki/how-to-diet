import {Row, Table} from 'antd'
import styled from 'styled-components'

export const DashboardWrapper = styled.div`
  width: 100%;
  padding: 0 80px;
  padding-top: 90px;
  @media screen and (max-width: ${_ => _.theme.width.l}) {
    padding-left: 40px;
    padding-right: 40px;
  }
  @media screen and (max-width: ${_ => _.theme.width.xs}) {
    padding-left: 20px;
    padding-right: 20px;
  }
`

export const RowContainer = styled(Row)<any>`
  margin-top: ${_ => _.theme.spacing.xs};
  margin-bottom: ${_ => _.theme.spacing.xs};
  align-items: center;
  @media screen and (max-width: ${_ => _.theme.width.xs} ) {
    font-size: 12px;
  }
`

export const DocumentsTable = styled(Table)`
  margin-top: ${_ => _.theme.spacing.lg};

  tr > th {
    border: 0;

    div {
      font-weight: 300;
    }
  }
`

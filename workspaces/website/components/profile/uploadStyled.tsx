import {Upload} from 'antd'
import styled from 'styled-components'

const StyledUpload = styled(Upload)<React.HTMLProps<HTMLElement>>`
  .ant-upload.ant-upload-select-picture-card {
    margin: 0px auto;
    margin-bottom: 20px;
  }
  .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0px;
  }
`
export default StyledUpload

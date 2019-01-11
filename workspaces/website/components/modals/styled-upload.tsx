import {Button, Upload} from 'antd'
import {BaseButtonProps} from 'antd/lib/button/button.d'
import styled from 'styled-components'

export const ModalButton = styled(Button)<BaseButtonProps & React.HTMLProps<HTMLElement>>`
  margin: 10px;
  min-width: 120px;
  text-transform:uppercase;
`
export const ModalDragger = styled(Upload.Dragger)`
  .ant-upload.ant-upload-drag{
    margin:auto;
    margin-bottom:20px;
    padding:15px;
    height:200px;
    max-width: 390px;
  }
  .ant-upload-disabled{
    filter: grayscale(100%);
  }
  .ant-upload-list{
    margin-bottom:15px;
  }
  .anticon-close svg{
    fill: ${props => props.theme.colors.meta.hex};
  }
  .ant-upload-list-item-name {
    color: ${props => props.theme.colors.meta.hex};
  }
  i.anticon.anticon-close {
    font-size: 20px;
    top: 0;
  }
  i.anticon.anticon-paper-clip {
    display: none;
  }

`

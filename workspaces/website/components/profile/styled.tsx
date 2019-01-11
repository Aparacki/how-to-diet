import {UI} from '@shared/config'
import styled from 'styled-components'

export const FormButton = styled.div`
  display: flex;
  justify-content: flex-end;
  max-width: 440px;
`

export const FormContainer = styled.div`
  width: 78%;
  @media screen and (max-width: ${UI.width.sm}) {
    order: 2;
  }
`
export const FormContainerAvatar = styled.div`
  width: 22%;
  display: flex;
  justify-content: flex-end;
  @media screen and (max-width: ${UI.width.sm}) {
    width: 100%;
    order: 1;

    margin-bottom: 24px;
    justify-content: center;
  }
`
export const FormContainerFlex = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: ${UI.width.sm}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

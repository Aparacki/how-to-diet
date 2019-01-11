import styled from 'styled-components'

export const Wrapper = styled.div`
  background: #F0F3F7;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`

export const Nav = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 24px;

  a, button{
    color: #1890FF;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 136px;
    font-size: 16px;
    line-height: 16px;
    margin-top: 15px;
    margin-bottom: 10px;
    border: 0;
  }
  .active::after {
    position: absolute;
    content: "";
    width: 100%;
    bottom: -10px;
    border-bottom: 2px solid #1890FF;
  }
`

export const Forgot = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex: 1;
  justify-content: flex-end;

  a {
  color: #1890FF;
  }
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 33px;
  font-weight: 500;
  }
  h3 {
    font-weight: 300;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
  .logo {
    line-height: 33px;
  }
`

export const FormContainer = styled.div`
  width: 100%;
`

export const Split = styled.div`
  height: 1px;
  width: calc(44% + 200px);
  background-color: #E8E8E8;

`

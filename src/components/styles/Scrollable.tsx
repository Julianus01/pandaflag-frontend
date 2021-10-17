import styled from 'styled-components/macro'

const Scrollable = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  overflow-y: overlay;
  overflow-y: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #fff;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
    border-radius: 16px;
    border: 5px solid transparent;
  }

  :hover::-webkit-scrollbar-thumb {
    background-color: #a0a0a5;
  }
`

import React, { useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 0 1em;
`;

const Overlay = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.45);
  z-index: 80;
`;

const Editor = styled.div`
  border-radius: 0.5em;
  background: #fff;
  padding: 0.5em;
  flex-grow: 1;
  z-index: 100;
  background: #f7f7f7;
  border: 1px solid rgba(0, 0, 0, 0.12);
  @media (max-width: 12000px) {
    max-width: 50%;
  }
  @media (max-width: 1200px) {
    max-width: 70%;
  }
  @media (max-width: 992px) {
    max-width: 80%;
  }
  @media (max-width: 768px) {
    max-width: 90%;
  }
  @media (max-width: 576px) {
    max-width: 100%;
  }
`;

const StyledReactQuill = styled(ReactQuill)`
  background: inherit;
  border-radius: 0.5em;
  & > .ql-toolbar {
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    border-bottom: none;
  }
  & > .ql-container {
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5em;
  & > button:last-child {
    margin-left: 0.5em;
  }
`;
const Button = styled.button`
  border-radius: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: none;
  padding: 0.5em;
  color: rgba(0, 0, 0, 0.87);
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 0.8em;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:focus {
    background: rgba(4, 206, 244, 0.12);
    outline: none;
  }
`;

const Title = styled.input`
  color: green;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 1.15em;
  color: rgba(0, 0, 0, 0.87);
  border: none;
  padding: 0.5em;
  background: #f7f7f7;
  &:focus {
    outline: none;
  }
`;

export default ({ newNote, noteData, close }) => {
  const [title, setTitle] = useState(noteData.title);
  const [body, setBody] = useState(noteData.body);

  const userId = useSelector(state => state.rootReducer.user.userId);
  console.log(userId);
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(
      newNote
        ? {
            type: "ADD_NOTE",
            payload: { user: userId, title: title, body: body }
          }
        : {
            type: "UPDATE_NOTE",
            payload: { ...noteData, title: title, body: body }
          }
    );
  };

  return (
    <Wrapper>
      <Overlay
        onClick={() => {
          window.confirm("Are you sure?") === true ? close() : void 0;
        }}
      />
      <Editor>
        <Title
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <StyledReactQuill
          placeholder="Text here"
          theme="snow"
          value={body}
          // onKeyUp={shallowSave}
          onChange={e => setBody(e)}
        />
        <ButtonWrapper>
          <Button onClick={handleSave}>Save</Button>
        </ButtonWrapper>
      </Editor>
    </Wrapper>
  );
};

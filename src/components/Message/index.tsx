import React from "react";
import styled, { css } from "styled-components";
import { IMessage } from "../../types/message";

const UserLabel = styled.div`
  font-size: 12px;
  text-decoration: underline;
`;

const MessageWrapper = styled.div<{ isCurrentUser: boolean }>`
  border: 1px solid lightgrey;
  padding: 15px;
  margin: 5px;
  width: 60%;
  display: grid;
  grid-gap: 10px;
  border-radius: 4px;
  background-color: whitesmoke;
  animation: fadein 0.2s;
  ${(props) =>
    props.isCurrentUser &&
    css`
      align-self: flex-end;
      background-color: teal;
      color: white;
      border: 1px solid #2e6068;
    `}

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

interface IMessageProps {
  currentName: string;
  message: IMessage;
  isContinuation?: boolean;
}

const Message = ({ currentName, message, isContinuation }: IMessageProps) => {
  return (
    <MessageWrapper isCurrentUser={currentName === message.user}>
      {!isContinuation && <UserLabel>{message.user}</UserLabel>}

      {message.text}
    </MessageWrapper>
  );
};

export default Message;

import React, { useEffect, useState, createRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import { PageWrapper } from "../../components/PageWrapper";
import { IMessage } from "../../types/message";
import Message from "../../components/Message";
import { Button } from "@material-ui/core";
import { IUser } from "../../types/user";

const socket = io(process.env.REACT_APP_SERVER_ENDPOINT as string);

const Grid = styled.div`
  display: grid;
  grid-template-columns: 400px 300px;
  grid-gap: 30px;
`;

const ChatWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  box-shadow: -7px 9px 30px -8px rgba(59, 59, 59, 1);
`;

const Topbar = styled.div<{ backgroundColor?: string; color?: string }>`
  padding: 15px;
  font-size: 20px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "teal"};
  color: ${(props) => (props.color ? props.color : "whitesmoke")};
`;

const MessagesWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid grey;
  height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 5px;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-gap: 15px;
`;

const BottomBar = styled.div``;

const StyledInput = styled.input`
  height: 100%;
  border: none;
  padding: 10px;
  height: 50px;
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;

const UserListWrapper = styled.div`
  background-color: white;
  box-shadow: -7px 9px 30px -8px rgba(59, 59, 59, 1);
  min-width: 200px;
`;

const UserList = styled.div`
  padding: 15px;
  display: grid;
  grid-gap: 10px;
  overflow-y: auto;
`;

const UserListItem = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: 10px;
  color: #3f3f3f;
`;

const Chat = () => {
  const location = useLocation();
  const history = useHistory();

  const [inputRef] = useState(createRef<HTMLInputElement>());
  const [bottomBarRef] = useState(createRef<HTMLDivElement>());
  const [currentName, setCurrentName] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const queries = queryString.parse(location.search);

    const { room, name } = queries;
    if (!room || !name) {
      return history.push("/");
    }

    socket.emit("join", { name, room }, () => {});
    setCurrentRoom(room as string);
    setCurrentName(name as string);

    return () => {
      socket.emit("disconnect");
      socket.close();
    };
  }, [location.search, history]);

  useEffect(() => {
    socket.on("message", (newMessage: IMessage) => {
      setMessages((messages) => [...messages, newMessage]);
    });
  }, []);

  useEffect(() => {
    socket.on(
      "roomData",
      ({ room, users }: { room: string; users: IUser[] }) => {
        if (room === currentRoom) {
          setUsers(users);
        }
      }
    );
  }, [currentRoom]);

  useEffect(() => {
    bottomBarRef?.current?.scrollIntoView();
  }, [messages, bottomBarRef]);

  const sendMessage = () => {
    socket.emit("sendMessage", message, ({ error }: { error?: string }) => {
      if (error) {
        alert(error);
      }

      setMessage("");
    });
  };

  return (
    <PageWrapper>
      <Grid>
        <ChatWrapper>
          <Topbar>{currentRoom}</Topbar>

          {currentName && (
            <MessagesWrapper>
              {messages.map((message, index) => {
                return (
                  <Message
                    key={`${message.text}-${index}`}
                    isContinuation={
                      index > 0 && messages[index - 1].user === message.user
                    }
                    currentName={currentName}
                    message={message}
                  />
                );
              })}
              <BottomBar ref={bottomBarRef} />
            </MessagesWrapper>
          )}

          <InputWrapper>
            <StyledInput
              ref={inputRef}
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button size="large" onClick={sendMessage}>
              Submit
            </Button>
          </InputWrapper>
        </ChatWrapper>
        <UserListWrapper>
          <Topbar>Active Users</Topbar>
          <UserList>
            {users.map((user) => {
              return (
                <UserListItem key={user.id}>
                  <FontAwesomeIcon icon={faUser} color="teal" />
                  <div>{user.name}</div>
                </UserListItem>
              );
            })}
          </UserList>
        </UserListWrapper>
      </Grid>
    </PageWrapper>
  );
};

export default Chat;

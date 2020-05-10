import React, { useState, ChangeEvent, FormEvent } from "react";
import { Paper, Input, Button } from "@material-ui/core";
import styled from "styled-components";

const PageWrapper = styled.div`
  background-color: teal;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled(Paper)`
  width: 600px;
  height: 400px;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InputsWrapper = styled.form`
  margin-top: 30px;
  display: grid;
  grid-gap: 20px;
  width: 60%;
`;

const Home = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("name", name);
    console.log("room", room);
  };

  return (
    <PageWrapper>
      <Card elevation={2}>
        <h1>Blabber</h1>
        <InputsWrapper onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <Input
            type="text"
            placeholder="Room"
            required
            value={room}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRoom(e.target.value)
            }
          />

          <Button type="submit">Join</Button>
        </InputsWrapper>
      </Card>
    </PageWrapper>
  );
};

export default Home;

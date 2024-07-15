// ChatRoom.js
import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ChatRoom = () => {
  const [messages, setMessages] = useState([])
  const [number, setNumber] = useState(0)
  const [input, setInput] = useState({})
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSendMessage = async (text) => {
    setMessages([...messages, ...text])
  }

  const inputChange = (event) => {
    const { name, value } = event.target

    setInput({
      ...input,
      [name]: value
    })
  }

  const authClick = (event) => {
    event.preventDefault()
    axios.post('http://localhost:8000/login', {
      username: input.username,
      password: input.password
    }).then(result => {
      console.log(result)
      window.localStorage.setItem('token', result.data.token)
    })
  }
  useEffect(() => {
    setNumber(number + 1)
  }, [messages.length])
  return (
    <div className="chat-room">
      <h1>Simple Chat Room</h1>
      {!window.localStorage.getItem('token') ?
        <Button onClick={handleOpen}>Login</Button>
        :
        <Button onClick={()=> window.localStorage.removeItem('token')}>Logout</Button>
      }
      <div>{window.localStorage.getItem('token')}</div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} messages={messages} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={authClick}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Login
            </Typography>

            <div>
              username
            </div>
            <Input name="username" onChange={inputChange} />
            <div>password</div>
            <Input name='password' type='password' onChange={inputChange} />
            <hr />
            <Button type='submit'>Login</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatRoom;

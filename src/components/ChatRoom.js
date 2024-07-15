// ChatRoom.js
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import DrawerList from './DrawerList';
import { Drawer } from '@mui/material';

const ChatRoom = () => {
  const [messages, setMessages] = useState([])

  const handleSendMessage = async (text) => {
    setMessages([...messages, ...text])
  }
  return (
    <div className="chat-room">

      <DrawerList/>
      <MessageList messages={messages} style={{ Height: '80vh' }} />
      <MessageInput onSendMessage={handleSendMessage} messages={messages} />
    </div>
  );
};

export default ChatRoom;

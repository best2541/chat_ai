// ChatRoom.js
import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = () => {
  const [messages, setMessages] = useState([])
  const [number, setNumber] = useState(0)

  const handleSendMessage = async (text) => {
    setMessages([...messages, ...text])
  }
  useEffect(() => {
    console.log(number + 1)
    setNumber(number + 1)
  }, [messages.length])
  return (
    <div className="chat-room">
      <h1>Simple Chat Room</h1>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;

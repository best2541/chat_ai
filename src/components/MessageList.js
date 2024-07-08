// MessageList.js
import React from 'react';

const MessageList = ({ messages, number }) => {
    return (
        <div className="message-list">
            {number}
            {messages.map((message, index) => (
                <div key={index} className="message-item">
                    {message.sender == 'User' &&
                        <>
                            <span>User :</span>
                            <p>{message.text}</p>
                        </>
                    }
                    {message.sender == 'Voice' &&
                        <>
                            <span>User :</span>
                            <audio src={message.text} controls="controls" />
                        </>
                    }
                    {message.sender == 'AI' &&
                        <>
                            <div style={{ textAlign: 'end' }}>: AI</div>
                            <p style={{ textAlign: 'end' }}>{message.text}</p>
                        </>
                    }
                </div>
            ))}
        </div>
    );
};

export default MessageList;

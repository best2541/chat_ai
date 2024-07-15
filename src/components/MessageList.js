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
                            <div style={{ textAlign: 'end' }}><span className='text_box'>{message.text}</span></div>
                        </>
                    }
                    {message.sender == 'Voice' &&
                        <>
                            {/* <span>User : </span> */}
                            <div style={{ textAlign: 'end' }}><audio src={message.text} controls="controls" /></div>
                        </>
                    }
                    {message.sender == 'AI' &&
                        <div>
                                <span>AI : </span>
                                <span className='text_box_ai'>{message.text}</span>
                            {/* <p style={{ textAlign: 'end' }}>{message.text}</p> */}
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};

export default MessageList;

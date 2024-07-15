// MessageInput.js
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import MicIcon from '@mui/icons-material/Mic'
import SendIcon from '@mui/icons-material/Send';
import { Button, Input } from '@mui/material';
const MicRecorder = require('mic-recorder-to-mp3')

const MessageInput = ({ onSendMessage, messages }) => {
    const btn = useRef()
    const [message, setMessage] = useState('')
    const [recorder] = useState(new MicRecorder({ bitRate: 128 }))
    const [isRecording, setIsRecording] = useState(false)
    const [blobURL, setBlobURL] = useState('')

    const startRecording = () => {
        recorder
            .start()
            .then(() => {
                setIsRecording(true)
            })
            .catch((e) => console.error(e))
    }

    const stopRecording = () => {
        recorder
            .stop()
            .getMp3()
            .then(async ([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                const formData = new FormData();
                formData.append('items', JSON.stringify(messages))
                formData.append('files', blob, 'test.mp3')
                onSendMessage([{ text: blobURL, sender: 'Voice' },{ text: 'กำลังพิมพ์...', sender: 'AI' }])
                setIsRecording(false)
                try {
                    if (!window.localStorage.getItem('token')) {
                        const response = await axios.post('http://localhost:8000/chat', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        onSendMessage([{ text: blobURL, sender: 'Voice' }, { text: response.data, sender: 'AI' }])
                    } else {
                        const response = await axios.post('http://localhost:8000/chat/auth/voice', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `${window.localStorage.getItem('token')}`
                            }
                        })
                        onSendMessage([{ text: blobURL, sender: 'Voice' }, { text: response.data, sender: 'AI' }])
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            })
            .catch((e) => console.log(e))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!window.localStorage.getItem('token')) {
            if (message.trim() !== '') {
                onSendMessage([{ text: message, sender: 'User' },{ text: 'กำลังพิมพ์...', sender: 'AI' }])
                setMessage('')
                axios.post(`http://localhost:8000/chat/text/?q=${message}`, {
                    items: messages,
                    q: message
                })
                    .then(result => {
                        onSendMessage([{ text: message, sender: 'User' }, { text: result.data, sender: 'AI' }])
                    })
            }
        } else {
            if (message.trim() !== '') {
                onSendMessage([{ text: message, sender: 'User' },{ text: 'กำลังพิมพ์...', sender: 'AI' }])
                setMessage('')
                axios.post(`http://localhost:8000/chat/auth/?q=${message}`, {
                    items: messages,
                    q: message
                }, {
                    headers: {
                        Authorization: `${window.localStorage.getItem('token')}`
                    }
                })
                    .then(result => {
                        onSendMessage([{ text: message, sender: 'User' }, { text: result.data, sender: 'AI' }])
                    })
            }
        }
        // axios.post('http://localhost:8000/voice', {
        //     items: messages
        // }).then(result => {
        //     console.log(result)
        // })
    }

    const imgChange = async (event) => {

        const formData = new FormData();
        formData.append('files', event.target.files[0]);

        try {
            const response = await axios.post('http://localhost:8000/chat/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    useEffect(() => {
    }, [])

    return (
        <form onSubmit={handleSubmit} style={{ height: '35px',paddingLeft:'5px' }}>
            <Input
                className='text_input'
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                // style={{ width: 'calc(100%-70px)', height: '35px', margin: 0, padding: 0 }}
            />
            <Button type="submit" style={{ height: '35px', width: '35px', margin: 0, paddingTop: 0, paddingBottom: 0 }}><SendIcon style={{ paddingTop: 0, paddingBottom: 0, margin: 0 }} /></Button>
            {!isRecording &&
                <Button onClick={startRecording} style={{ height: '34px', width: '35px', margin: 0 }}>
                    <MicIcon />
                </Button>
            }
            {isRecording &&
                <Button onClick={stopRecording} style={{ height: '34px', width: '35px', margin: 0 }}>
                    <MicIcon color='error' />
                </Button>
            }
        </form>
    )
}

export default MessageInput

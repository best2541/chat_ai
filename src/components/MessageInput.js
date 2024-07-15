// MessageInput.js
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
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
                onSendMessage([{ text: blobURL, sender: 'Voice' }])
                setIsRecording(false)
                try {
                    if(!window.localStorage.getItem('token')) {
                        const response = await axios.post('http://localhost:8000/', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        onSendMessage([{ text: blobURL, sender: 'Voice' }, { text: response.data, sender: 'AI' }])
                    } else {
                        const response = await axios.post('http://localhost:8000/auth/voice', formData, {
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
                onSendMessage([{ text: message, sender: 'User' }])
                setMessage('')
                axios.post(`http://localhost:8000/text/?q=${message}`, {
                    items: messages,
                    q: message
                })
                    .then(result => {
                        onSendMessage([{ text: message, sender: 'User' }, { text: result.data, sender: 'AI' }])
                    })
            }
        } else {
            if (message.trim() !== '') {
                onSendMessage([{ text: message, sender: 'User' }])
                setMessage('')
                axios.post(`http://localhost:8000/auth/?q=${message}`, {
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
            const response = await axios.post('http://localhost:8000/upload', formData, {
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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
            {!isRecording &&
                <button onClick={startRecording} disabled={isRecording}>
                    Start Recording
                </button>
            }
            {isRecording &&
                <button onClick={stopRecording} disabled={!isRecording}>
                    Stop Recording
                </button>
            }
            {blobURL && <audio src={blobURL} controls="controls" />}
            <input type="file" onChange={imgChange} />
            <div>{blobURL}</div>
        </form>
    )
}

export default MessageInput

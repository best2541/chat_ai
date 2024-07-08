// MessageInput.js
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
const MicRecorder = require('mic-recorder-to-mp3')

const MessageInput = ({ onSendMessage }) => {
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
                formData.append('files', blob, 'test.mp3')
                onSendMessage([{ text: blobURL, sender: 'Voice' }])
                setIsRecording(false)
                try {
                    const response = await axios.post('http://localhost:8000/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    onSendMessage([{ text: blobURL, sender: 'Voice' }, { text: response.data, sender: 'AI' }])
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            })
            .catch((e) => console.log(e))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim() !== '') {
            onSendMessage([{ text: message, sender: 'User' }])
            setMessage('')
            axios.get(`http://localhost:8000/text/?q=${message}`)
                .then(result => {
                    onSendMessage([{ text: message, sender: 'User' }, { text: result.data, sender: 'AI' }])
                })
        }
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

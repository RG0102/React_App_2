import React, { useState } from 'react';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Instantiate the Google Cloud Text-to-Speech client
const client = new TextToSpeechClient();

const TextToSpeech = () => {
    const [message, setMessage] = useState("");

    const handleTextChange = (e) => {
        setMessage(e.target.value);
    };

    const synthesizeSpeech = async (text) => {
        try {
            // Construct the request
            const request = {
                input: { text: text },
                voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
                audioConfig: { audioEncoding: 'MP3' },
            };

            // Perform the text-to-speech request
            const [response] = await client.synthesizeSpeech(request);

            // Create an audio element and play the audio
            const audioContent = response.audioContent;
            const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
            audio.play();
        } catch (error) {
            console.error('Error during text-to-speech synthesis:', error);
        }
    };

    return (
        <div>
            <h1>Text-to-Speech with Google Cloud</h1>
            <input
                type="text"
                value={message}
                onChange={handleTextChange}
                placeholder="Type something to speak"
            />
            <button onClick={() => synthesizeSpeech(message)}>
                Speak Text
            </button>
        </div>
    );
};

export default TextToSpeech;

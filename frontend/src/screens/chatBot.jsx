
import React, { useState } from 'react';
import './ChatBot.css'; // Import your custom CSS for additional styling if needed

// Provides a small chatbot widget that sends prompts to the backend generator.
const ChatBot = ({ handleSubmit, prompt, setPrompt }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [response, setResponse] = useState(null);

    // Opens or closes the chat widget.
    // Opens or closes the chatbot panel.
    const toggleChatBot = () => {
        setIsOpen(!isOpen);
    };

    // Sends the prompt to the backend and displays the generated response.
    // Sends the prompt to the API and displays the returned answer.
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            
            // Directly set the response without any parsing or modifications
            setResponse(data.response);
        } catch (error) {
            console.error('Error:', error);
            setResponse('There was an error processing your request.');
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-icon" onClick={toggleChatBot}>
                🤖
            </div>
            {isOpen && (
                <div className="chatbot-window card bg-dark text-white">
                    <button className="btn-close close-button" onClick={toggleChatBot}></button>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="prompt" className="form-label">Enter your prompt:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    {response && (
                        <div className="mt-4">
                            <h5>Response:</h5>
                            <div className="bg-secondary p-3 rounded text-white">{response}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBot;

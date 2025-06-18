// src/components/common/AiChatWindow.js
import React, { useState, useEffect, useRef } from 'react';

const AiChatWindow = ({ messages, onSendMessage, isLoading, initialMessage }) => {
    const [userInput, setUserInput] = useState('');
    const chatMessagesRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    // Effect to display initial message once
    useEffect(() => {
        if (initialMessage && messages.length === 0) {
            // This assumes parent will add initialMessage to messages array upon receiving it
            // Or, the component could have its own internal message state initialized by initialMessage
            // For now, let's assume parent handles message array population.
        }
    }, [initialMessage, messages.length]);


    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() && onSendMessage && !isLoading) {
            onSendMessage(userInput.trim());
            setUserInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline in textarea
            handleSend();
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md w-full max-w-md mx-auto my-4 fixed-chat-height flex flex-col">
            {/* Header (Optional) */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-700">AI Assistant</h3>
                {/* Add a close button here if needed, e.g., passed via props:
                {onClose && <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>}
                */}
            </div>

            {/* Messages Area */}
            <div ref={chatMessagesRef} className="flex-grow p-4 space-y-3 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                            msg.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                        }`}>
                            {/* Basic rendering of text. For more complex messages (e.g. markdown), a library might be needed. */}
                            {typeof msg.text === 'string' ? msg.text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>{line}{i !== msg.text.split('\n').length - 1 && <br />}</React.Fragment>
                            )) : 'Invalid message format'}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center space-x-2">
                    <textarea
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a follow-up question..."
                        className="flex-grow p-2 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !userInput.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
            {/* CSS for fixed height - this should be in a global CSS or App.css if not using Tailwind for everything */}
        </div>
    );
};

export default AiChatWindow;

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
        // =============== ADD THIS LOG ===============
        console.log('[AiChatWindow] handleSend called. User input:', userInput);

        if (userInput.trim() && onSendMessage && !isLoading) {
            console.log('[AiChatWindow] Calling onSendMessage with:', userInput.trim()); // Log 2
            onSendMessage(userInput.trim());
            setUserInput('');
        } else {
            console.log('[AiChatWindow] onSendMessage not called. Conditions not met:',
                { hasInput: !!userInput.trim(), hasOnSendMessage: !!onSendMessage, isNotLoading: !isLoading });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline in textarea
            handleSend();
        }
    };

    return (
        // Main container: Keep bg-white, border-gray-300, rounded-lg, shadow-lg. Size classes as per previous step.
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-xl lg:max-w-2xl mx-auto my-4 min-h-[450px] h-[65vh] max-h-[700px] flex flex-col">
            {/* Header: Slightly lighter, or use a common site header color if known. For now, subtle gray. */}
            <div className="p-3 border-b border-gray-200 bg-slate-100 rounded-t-lg">
                <h3 className="text-lg font-semibold text-slate-800">AI Assistant</h3>
                {/* Optional close button can be styled here too */}
            </div>

            {/* Messages Area: Keep as is, or slightly lighter background if main bg-white is too stark for messages. */}
            <div ref={chatMessagesRef} className="flex-grow p-4 space-y-3 overflow-y-auto bg-slate-50"> {/* Added bg-slate-50 for slight contrast */}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-xl max-w-xs lg:max-w-md shadow-sm ${ // Changed to rounded-xl, added shadow-sm
                            msg.sender === 'user'
                                ? 'bg-indigo-600 text-white' // Example: Using Indigo for user
                                : 'bg-stone-200 text-stone-800' // Example: Using a warmer gray for AI
                        }`}>
                            {typeof msg.text === 'string' ? msg.text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>{line}{i !== msg.text.split('\n').length - 1 && <br />}</React.Fragment>
                            )) : 'Invalid message format'}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 shadow-sm"> {/* Matched AI bubble style */}
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area: Match header background for consistency. */}
            <div className="p-3 border-t border-gray-200 bg-slate-100 rounded-b-lg">
                <div className="flex items-center space-x-2">
                    <textarea
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a follow-up question..."
                        className="flex-grow p-2 border border-gray-300 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" // Added rounded-lg, shadow-sm
                        rows="2"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !userInput.trim()}
                        // Example: Using Indigo to match user bubble, or a general site primary button color
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors duration-150" // Added rounded-lg, shadow-sm, transition
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiChatWindow;

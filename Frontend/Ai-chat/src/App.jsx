import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css' 

const App = () => {

  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I\'m your AI assistant. How can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);
  const socketRef = useRef(null);

 
  useEffect(() => {
    const socket = io('https://mini-chatbot-3uvc.onrender.com');
    socketRef.current = socket;
 
    socket.on('ai-response', (data) => {
      console.log('Received AI response:', data); 
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: data.response },
      ]);
      setIsLoading(false); 
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStopConversation = () => {
      setIsLoading(false); 
      setInputMessage(''); 
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim().toLowerCase() === 'stop') {
        handleStopConversation();
        return; 
    }

    if (inputMessage.trim() === '' || isLoading) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: inputMessage },
    ]);
    setIsLoading(true); 

    try {
      socketRef.current.emit('ai-message', inputMessage);
    } catch (error) {
      console.error('Socket.IO emit failed:', error);
      setIsLoading(false); 
    }
    
    setInputMessage(''); 
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center  font-sans antialiased">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-full flex flex-col overflow-hidden sm:rounded-lg sm:p-2">
        
        <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-500 mr-3">Bot.io</span>
         
        </div>

        <div ref={chatWindowRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-70 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg max-w-70 bg-gray-200 text-gray-800">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

      
        <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200 flex items-center">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus-outline-none focus-ring-2 focus-ring-blue-500"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          {isLoading ? (
             <button
                type="button" 
                onClick={handleStopConversation}
                className="ml-3 p-3 rounded-lg bg-red-500 text-white flex-shrink-0 hover:bg-red-600 transition-colors duration-200"
             >
                Stop
             </button>
          ) : (
             <button
                type="submit"
                className="ml-3 p-3 rounded-lg bg-blue-500 text-white flex-shrink-0 hover:bg-blue-600 transition-colors duration-200"
             >
                Send
             </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;
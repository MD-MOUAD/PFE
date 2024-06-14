import React, { useState, useRef, useEffect } from 'react';
import sehmImage from '../../../public/img/right-arrow.png';
import './Chat.css';

function parseText(text) {
    // Check if the input is a string
    if (typeof text !== 'string') {
      return text; // Return input unchanged if it's not a string
  }
  
  // Split the text by the period followed by a digit
  const sentences = text.split(/(?<=\.)\s*(?=\d+\.)|(?<=\d)\./g);
  // Join the sentences with a newline character
  const outputText = sentences.join('\n');
  return outputText;
}
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOption, setselectedOption] = useState('basic'); // New state for switch
  const chatRef = useRef(null);
  const [email, setEmail] = useState();
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };
  const storedUser = localStorage.getItem('user');

  useEffect(() => {
    scrollToBottom();  if (storedUser) {
      console.log("Found stored user data:", JSON.parse(storedUser));
      const userData = JSON.parse(storedUser);
      setEmail(userData.user.email);
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (userInput.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', message: userInput },
      ]);
      setUserInput('');
      setIsTyping(true);

      const processResponse = await fetch('http://localhost:5000/api/prc/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput, selectedOption, email}), // Include selectedOption in the request
      });

      if (processResponse.ok) {
        const { output } = await processResponse.json();
        setMessages((prevMessages) => [
          ...parseText(prevMessages),
          { type: 'ai', message: parseText(output) },
        ]);
      } else {
        console.error('Error processing file');
      }

      setIsTyping(false);
    }
  };

  const toggleselectedOption = () => {
    setselectedOption((prevselectedOption) => (prevselectedOption === 'basic' ? 'openai' : 'basic'));
  };

  return (
    <div className="chatbot-container">
      <div className="chat-interface" ref={chatRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.type}`}>
            {message.message}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble ai">
            <div className="typing-effect">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="input-bar-container">
        <div className="input-bar">
        <div className="selectedOption-switch">
        <span>{selectedOption}</span>
            <label className="switch">
              <input type="checkbox" onChange={toggleselectedOption} />
              <span className="slider"></span>
            </label>
            
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>
            <img src={sehmImage} alt="Send" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Chat;

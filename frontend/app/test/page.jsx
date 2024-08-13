'use client'
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import ChatHeader from "./ui/Header";
import LoadingIndicator from "./ui/Loading";
import './chatbot.css';
// import { Chatbox } from '@talkjs/react';

const ChatbotContainer = styled(animated.div)`
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 10px;
  right: 10px;
  width: 300px;
  height: 400px;
  border: 1px solid #ccc;
  padding: 10px;
  background: linear-gradient(to bottom, yellow 100px, #F8EDED 100px);
  // background-color: #F8EDED;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

const Chatbox = styled.div`
  flex: 1;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  // padding-bottom: 10px;
`;

const MessageInput = styled.input`
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: calc(70% - 10px);
  height: 20px;
  font-size:15px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 20px;
`;


const AssistantButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 100px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #0056b3;
  }
`;


const BoldText = ({ children }) => <strong>{children}</strong>;
const LineBreak = () => <br />;

const renderHTML = (htmlContent) => {
if (typeof htmlContent === "string") {
  // Basic HTML parsing (only for simple cases)
  const parts = htmlContent.split(/(\*\*.*?\*\*|\n)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <BoldText key={index}>{part.slice(2, -2)}</BoldText>;
    } else if (part === "\n") {
      return <LineBreak key={index} />;
    } else {
      return <span key={index}>{part}</span>;
    }
  });
} 
else if (typeof htmlContent === "object") {
  return (
    <LoadingIndicator />
  );
}
//   // Example: If the object contains a "text" property
//   if (htmlContent.text) {
//     return <span>{htmlContent.text}</span>;
//   } else {
//     // Handle other cases or properties
//     return <span>{JSON.stringify(htmlContent)}</span>;
//   }
// } else {
//   return <span>Unsupported content type</span>;
// }
};

const Message = ({ role, content }) => (
  <div
    style={{
      marginBottom: '5px',
      padding: '1px 2px',
      borderRadius: '5px',
      backgroundColor: role === 'user' ? '#d1e7dd' : '#f8d7da', // Different colors for user and bot
    }}
  >
  <p>
    <strong>{role === 'user' ? 'You' : 'Bot'}: </strong>
    {renderHTML(content)}
  </p>
</div>
);

export default function SupportChatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const sendMessage = async () => {
    setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'bot', content: <LoadingIndicator /> }]);
    setMessage('');

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();

    // Update the last "Loading..." message with the actual bot response
    setChatHistory((prevChatHistory) => {
      const updatedChat = [...prevChatHistory];
      updatedChat[updatedChat.length - 1] = { role: 'bot', content: data.response };
      return updatedChat;
    });
  };

  const props = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(-50px)' : 'translateY(50px)',
    config: { tension: 220, friction: 20 },
  });

  return (
    <>
      <AssistantButton onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Close Assistant' : 'Open Assistant'}
      </AssistantButton>
      
      <ChatbotContainer style={props} isVisible={isVisible}>
        <ChatHeader name = "EW Assistant"/>
        <Chatbox id="chatbox">
          {chatHistory.map((chat, index) => (
            <Message key={index} role={chat.role} content={chat.content} />
          ))}
        </Chatbox>
        <MessageInput
          type="text"
          value={message}
          className='inpcontainer'
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
              }
            } 
          } 
        />
        <button
          className="submitButton"
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
          onClick={sendMessage}
        >
          Send
        </button>
      </ChatbotContainer>
    </>
  );
}

import React from 'react';

const ChatbotTest = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'orange',
        color: 'white',
        padding: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
        cursor: 'pointer'
      }}
    >
      CHAT
    </div>
  );
};

export default ChatbotTest;

import React from 'react';

const Loading = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <img 
        src="/src/assets/loading.gif" 
        alt="Loading..." 
        style={{ width: 128, height: 128 }} 
      />
    </div>
  );
};

export default Loading;

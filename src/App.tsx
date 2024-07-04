// src/App.tsx
import React from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Main />
    </div>
  );
};

export default App;

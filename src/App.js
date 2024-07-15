// App.js
import React from 'react';
import ChatRoom from './components/ChatRoom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import './index.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ChatRoom />
      </ThemeProvider>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {
  const [state, setState] = useState({ message: '', user: '' });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('messageSent', ({ chat }) => {
      setChat(chat);
    });
  }, [state]);

  useEffect(() => {
    socket.on('join', ({ chat }) => setChat(chat));
  }, []);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { user, message } = state;
    socket.emit('messageSent', { user, message });
    setState({ message: '', user });
  };

  const renderChat = () => {
    return chat.map(({ sender, message }, index) => (
      <div key={index}>
        <h3>
          {sender}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className='card'>
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className='name-field'>
          <TextField
            name='user'
            onChange={(e) => onTextChange(e)}
            value={state.user}
            label='Name'
          />
        </div>
        <div>
          <TextField
            name='message'
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id='outlined-multiline-static'
            variant='outlined'
            label='Message'
            required
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className='render-chat'>
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;

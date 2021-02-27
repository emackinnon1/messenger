import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {
  const [state, setState] = useState({ message: '', user: '', search: '' });
  const [chat, setChat] = useState([]);
  const messageRef = useRef(null);

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
    return chat.map(({ sender, message, sent }, index) => (
      <div key={index}>
        <p className='timestamp'>{moment(sent).format('MMM Do YYYY, h:mm:ss a')}</p>
        <h3>
          {sender}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  useEffect(() => {
    socket.on('messageSent', ({ chat }) => {
      setChat(chat);
    });
  }, [state]);

  useEffect(() => {
    socket.on('join', ({ chat }) => setChat(chat));
  }, []);

  useEffect(() => {
    messageRef.current.scrollIntoView(false);
  }, [chat]);

  return (
    <div className='app'>
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
        <button className='send-message'>Send Message</button>
        <div className='search'>
          <TextField
            name='search'
            onChange={(e) => onTextChange(e)}
            value={state.search}
            id='outlined-multiline-static'
            variant='outlined'
            label='Search by sender'
            size='small'
          />
          <button className='search-msgs'>Search</button>
        </div>
      </form>
      <div className='render-chat' ref={messageRef}>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;

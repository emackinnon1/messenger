import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {
    // state
    const [state, setState] = useState({ message: '', user: '', search: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [chat, setChat] = useState([]);
    const [noResult, setNoResult] = useState(false);
    const messageRef = useRef(null);

    useEffect(() => {
        messageRef.current.scrollIntoView(false);
    }, [chat]);

    // methods
    const onTextChange = (e) => {
        setState({...state, [e.target.name]: e.target.value });
    };

    const onMessageSubmit = (e) => {
        e.preventDefault();
        const { user, message } = state;
        socket.emit('messageSent', { user, message });
        setState({ message: '', user });
    };

    const searchMessages = (e) => {
        e.preventDefault();
        const { search } = state;
        socket.emit('search', { userToSearch: search });
    };

    const renderMessages = (messages) => {
        return messages.map(({ sender, message, sent }, index) => ( <
            div key = { index } >
            <
            p className = 'timestamp' > { moment(sent).format('MMM Do YYYY, h:mm:ss a') } < /p> <
            h3 > { sender }: < span > { message } < /span> <
            /h3> <
            /div>
        ));
    };

    const clear = () => {
        setSearchResults([]);
        setState({...state, search: '' });
        setNoResult(false);
    };

    // socket events
    socket.on('messageSent', ({ chat }) => {
        setChat(chat);
    });
    socket.on('join', ({ chat }) => setChat(chat));
    socket.on('search', ({ results }) => setSearchResults(results));
    socket.on('noResult', () => {
        setNoResult(true);
    });

    return ( <
        div className = 'app' >
        <
        div className = 'forms' >
        <
        form className = 'message-form'
        onSubmit = { onMessageSubmit }
        onFocus = {
            () => clear() } >
        <
        h1 > King Midas 's Messenger</h1> <
        p >
        Send things like your SSN, bank account info or credit card number over our super secure messenger we are definitely not recording every key stroke. <
        /p> <
        div className = 'name-field' >
        <
        TextField name = 'user'
        onChange = {
            (e) => onTextChange(e) }
        value = { state.user }
        label = 'Username'
        required /
        >
        <
        /div> <
        div >
        <
        TextField name = 'message'
        onChange = {
            (e) => onTextChange(e) }
        value = { state.message }
        id = 'outlined-multiline-static'
        variant = 'outlined'
        label = 'Message'
        required /
        >
        <
        /div> <
        button className = 'send-message' > Send Message < /button> <
        /form> <
        form className = 'search'
        onSubmit = { searchMessages } >
        <
        TextField name = 'search'
        onChange = {
            (e) => onTextChange(e) }
        value = { state.search }
        id = 'outlined-multiline-static'
        variant = 'outlined'
        label = 'Search by sender'
        required /
        >
        <
        button className = 'search-btn' > Search < /button> <
        /form> <
        button onClick = {
            () => clear() }
        className = 'clear-search-btn' >
        Clear Search <
        /button> {
            noResult && < p > No results
            for this user.Please make sure spelling is correct. < /p>} <
                /div>

            <
            div className = 'render-chat'
            ref = { messageRef } > { searchResults.length ? renderMessages(searchResults) : renderMessages(chat) } <
                /div> <
                /div>
        );
    }

    export default App;
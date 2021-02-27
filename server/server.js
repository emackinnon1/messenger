const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const { Message, User } = require('./bookshelf');

io.on('connection', (socket) => {
  socket.on('message', async ({ user, message }) => {
    // const user = await new User({ name }).save();
    // const msg = await new Message({ message, user_id: user.get('id') }).save();
    io.emit('message', { user, message });
  });
});

http.listen(4000, () => {
  console.log('IT. IS. ALIIIIIVE.');
});

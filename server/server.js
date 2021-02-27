const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const { Message, User } = require('./bookshelf');

const findOrCreateUser = async (userName) => {
  let user;
  user = await User.where({ name: userName }).fetch({ require: false });
  if (!user) {
    const newUser = await new User({ name: userName }).save();
    user = newUser;
  }
  return user;
};

const returnChatHistory = async () => {
  return await Message.fetchAll({ require: false });
};

io.on('connection', async (socket) => {
  const history = await returnChatHistory();
  socket.emit('join', { chat: history });

  socket.on('messageSent', async ({ user, message }) => {
    const sender = await findOrCreateUser(user);
    console.log(sender.get('id'));

    await new Message({ message, user_id: sender.get('id'), sender: user }).save();

    io.emit('messageSent', { chat: history });
  });
});

http.listen(4000, () => {
  console.log('IT. IS. ALIIIIIVE.');
});
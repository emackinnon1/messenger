const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const { Message, User } = require('./bookshelf');
const moment = require('moment');

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
  // Send chat history on user joining
  socket.emit('join', { chat: await returnChatHistory() });

  // Create new user and message on "messageSent" event and return chat history
  socket.on('messageSent', async ({ user, message }) => {
    const sender = await findOrCreateUser(user);
    await new Message({ message, user_id: sender.get('id'), sender: user }).save();

    io.emit('messageSent', { chat: await returnChatHistory() });
  });

  // Find user's messages on "search" event
  socket.on('search', async ({ userToSearch }) => {
    const user = await User.where({ name: userToSearch }).fetch({
      require: false,
      withRelated: ['messages'],
    });

    const thirtyDaysAgo = moment().subtract(30, 'd');

    const results = user
      .related('messages')
      .filter((msg) => {
        return thirtyDaysAgo.isBefore(msg.sent);
      })
      .splice(0, 100);

    io.emit('search', { results });
  });
});

http.listen(4000, () => {
  console.log('IT. IS. ALIIIIIVE.');
});

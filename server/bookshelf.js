// Setting up the database connection
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'chat_admin',
    password: 'password',
    database: 'GuildedChat',
    charset: 'utf8',
  },
});
const bookshelf = require('bookshelf')(knex);

// Defining models
const Message = bookshelf.model('Message', {
  tableName: 'messages',
  currentTimestamp: () => bookshelf.knex.fn.now(),
});

const User = bookshelf.model('User', {
  tableName: 'users',
});

module.exports = { Message, User };

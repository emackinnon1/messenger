// Set up the database connection
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

// Define models
const Message = bookshelf.model('Message', {
  tableName: 'messages',
  currentTimestamp: () => bookshelf.knex.fn.now(),
  user() {
    return this.hasOne(User);
  },
});

const User = bookshelf.model('User', {
  tableName: 'users',
  messages() {
    return this.hasMany(Message);
  },
});

module.exports = { Message, User };

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
  user() {
    return this.hasOne(model.User);
  },
});

const User = bookshelf.model('User', {
  tableName: 'users',
  messages() {
    return this.hasMany(model.Message);
  },
});

module.exports = { Message, User };

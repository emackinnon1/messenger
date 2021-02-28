# Guilded Messenger

[!alt-text](https://github.com/emackinnon1/messenger/gilded-chat.gif)

## Overview

This is a small full stack application built in React with Hooks using a backend in Node.js with an Express.js framework. The MySQL database uses Bookshelf.js for the ORM, which runs on Knex.js under the hood. NPM was used as the package manager. For communication between the frontend and backend, `socket.io-client` and `socket.io` were used, respectively. Various other packages such as `moment.js` and `material-ui` were utilized as well.

The frontend connects to the backend via websockets and upon doing so, the most recent chat history is loaded. The backend queries the db using Bookshelf and pulls all message sent within the last 30 days, pulling out the most recent 100. A user can provide a username and type a message in the form on the left side of the page. Upon submitting, the message is sent to the server and created in the `messages` table. When a message is sent, the user is also added to the db if it does not already exist in order to provide an easy way to query the db later on for a specific user's sent messages.
To search for a specific user's messages, another form on the left is provided. Entering a username that exists in the db and clicking "Search" will pull up only that username's sent messages. On the backend, the db is queried for that particular username and the one to many relationship is leveraged to pull in on all of that user's messages. The messages are filtered to the last 30 days and only the most recent 100 from that time period.

## Set up

1. Clone down this repo.
2. In a new terminal window, cd into `/server` and run `npm install` to install dependencies.
3. To create the database, run `npm run db:create`. When prompted for a password simply hit enter.
4. After successfully creating the db, run `npm start`.
5. Open a separate terminal and cd into `/client`.
6. Run `npm install` and then `npm start`.
7. A browser window should open automatically, but if it does not, navigate to `http://localhost:3000` in your favorite browser.

## Challenges and future iterations

Having never worked with most of the technology in this app, it was a challenge to stand up. This was the first time writing raw SQL (as in `seed.sql`), setting up a connection between an ORM and a database, creating models on the ORM, and using websockets. Also, the design of the app took some thinking on how best to implement it. If I had more time, I would set up testing either by mocking out the behavior of `socket.io` and testing the corresponding behavior from the app on both the backend with mocked-out Bookshelf models as well as using React Testing Library and Jest to test the DOM. Another option would be to use Cyprus and test the actual behavior of a spun up app. Better error handling could be done, as well as a better database design that could allow for more functionality like chat rooms, sending specific messages to specific users, etc.

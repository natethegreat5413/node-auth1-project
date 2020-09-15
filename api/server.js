const express = require('express');
const server = express();
const helmet = require('helmet')
const bcryptjs = require('bcryptjs')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const userRouter = require('../routers/user-router')
const authRouter = require('../auth/auth-router')
const dbConfig = require('../data/dbConfig')
const protectedMW = require('../protected/protected-mw')


const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: true, // ask the client if it's ok to save cookies (GDPR compliance)
    cookie: {
        maxAge: 1000 * 60 * 60, // in milliseconds
        secure: process.env.USE_SECURE_COOKIES || false, // true means use only over https connections
        httpOnly: true, // true means the JS code on the clients CANNOT access this cookie
    },
    // saves session information to a table
    store: new KnexSessionStore({
      knex: dbConfig, // knex connection to the database
      tablename: 'sessions',
      sidfieldname: 'sid',
      createTable: true,
      clearInterval: 100 * 60 * 60, // remove expired sessions every hour
    })
};

server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session(sessionConfig))

server.use('/api/users', protectedMW, userRouter)
server.use('/api/auth', authRouter)



server.get('/', (req, res) => {
    res.send({API: 'UP'})
})

module.exports = server;
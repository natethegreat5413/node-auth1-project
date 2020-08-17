const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/users-router')
const authRouter = require('../auth/auth-router')
const protectedMW = require('../auth/protected-mw')
const dbConnection = require('../database/connection')

const server = express()

const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || 'keep it a secret',
    cookie: {
        maxAge: 1000 * 60 * 10, // 10 min
        secure: process.env.COOKIE_SECURE || false,
        httpOnly: true, // js code on the client cannot access the session cookie
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 6000, // delete expired sessions
    }),
};

server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session(sessionConfig)); // turn on sessions globally

server.use('/api/users', protectedMW, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({ api: 'up'})
})

server.get('/hash', (req, res) => {
    try {
        const password = req.headers.password;
        const rounds = process.env.HASH_ROUNDS || 8;
        const hash = bcrypt.hashSync(password, rounds);

        res.status(200).json({ password, hash })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = server;
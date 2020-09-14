const express = require('express');
const server = express();
const helmet = require('helmet')
const bcryptjs = require('bcryptjs')

server.use(express.json());


server.get('/', (req, res) => {
    res.send({API: 'UP'})
})

module.exports = server;
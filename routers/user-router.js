const router = require('express').Router()

const Users = require('./users-model')

router.get('/', (req, res) => {
    Users.get()
    .then(user => {
        res.status(200).json({user})
    })
    .catch(error => {
        res.status(500).json({ message: error.message })
    })
})
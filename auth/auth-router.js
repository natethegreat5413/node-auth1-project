const router = require('express').Router()
const bcryptjs = require('bcryptjs')

const Users = require('../routers/user-model')
const { Router } = require('express')


// REGISTER A NEW USER
router.post('/register', (req, res) => {
    const {username, password} = req.body;
    
    const rounds = process.env.HASH_ROUNDS || 12
    const hash = bcryptjs.hashSync(password, rounds);

    Users.add({ username, password: hash})
        .then(user => {
            res.status(201).json({ data: user })
        })
})

// LOG NEW USER IN
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .then(users => {
            const user = users[0];

            if (user && bcryptjs.compareSync(password, user.password)){
                req.session.loggedIn = true;
                res.status(200).json({ hello: user.username, session: req.session, })
            }else{
                res.status(401).json({ error: "user cannot be found" })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message })
        })
})

// USER LOGS OUT
router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error){
                res.status(500).json({ message: 'Could not log you out, please try again.' })
            }else{
                res.status(204).end()
            }
        })
    }else{
        res.status(200).json({ message: "already logged out" })
    }
})


// MIDDLEWARE

// VALIDATE NEW USER

// VALIDATE NEW USERS CREDENTIALS



module.exports = router
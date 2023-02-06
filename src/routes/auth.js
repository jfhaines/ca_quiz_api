import express from 'express'
import { UserModel } from '../db.js'
import router from './subject.js'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Signup
router.post('/signup', [
    body('username', 'Must enter a valid username.').trim().isLength({ min: 1 }).escape(),
    body('password', 'Must enter a valid password.').trim().isLength({ min: 6 }).escape(),

    async (req, res) => {
        try {
            let valErrors = validationResult(req)
            if (!valErrors.isEmpty()) {
                return res.status(400).send({ error: 'You must enter a valid username and password' })
            }
    
            let hash = await bcrypt.hash(req.body.password, 10)
            let userInstance = new UserModel({
                username: req.body.username,
                password: hash
            })
            await userInstance.save()
    
            let token = jwt.sign({
                userId: userInstance._id
            }, 'secret', { expiresIn: '18h'})
    
            res.status(201).send({ jwtToken: token, userId: userInstance._id })
        } catch (err) {
            if (err.code === 11000) {
                res.status(400).send({ error: 'Username already exists' })
            } else {
                res.status(500).send({ error: err.message })
            }
        }
    }
])


router.post('/login', async (req, res) => {
    try {
        let user = await UserModel.findOne({ username: req.body.username })
        if (!user) {
            res.status(400).send({error: 'No such user exists'})
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({
                        userId: user._id
                    }, 'secret', { expiresIn: '18h'})
                    res.status(200).send({ jwtToken: token, userId: user._id })
                } else {
                    res.status(400).send({ error: 'Username or password is incorrect' })
                }
            })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


export default router
const router = require('express').Router();
const { createToken, validateToken } = require('../auth');
const Note = require('../models/Note');
const User = require('../models/User');

async function isAuthenticated(req, res, next) {
    try {
        // Pull the token from the cookie that is storing it
        const token = req.cookies.token;

        if (!token) throw new Error('You are not authorized to perform that action');

        // Check the token against the secret 
        const data = await validateToken(token);

        // Find a user by the Id that was stored on the token
        const user = await User.findById(data.userId).populate('notes');

        req.user = user;
        // Move on to the next function in the cb
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).send({
            error: true,
            message: err.message
        })
    }
}

// User routes
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);

        // Gives us a token back
        const token = await createToken(user._id);

        res.cookie('token', token, {
            httpOnly: true
        });

        res.send({
            user
        });

    } catch (err) {
        console.log(err);
        res.status(401).send({
            error: true,
            message: err.message
        });
    }
});

// Login User
router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findOne({
            email: req.body.email
        }).populate('notes');
        if (!user) throw new Error('User not found');

        // verify their password
        const validPass = await user.validatePass(req.body.password);
        if (!validPass) throw new Error('Password is incorrect');

        // Give user a token 
        const token = await createToken(user._id);

        res.cookie('token', token, { httpOnly: true });

        res.send({ user });

    } catch (err) {
        console.log(err);
        res.status(401).send({
            error: true,
            message: err.message
        });
    }
});

// Check if user is logged in
router.get('/authenticate', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.send({ user: null });

        const data = await validateToken(token);

        const user = await User.findById(data.userId).populate('notes');
        res.send({ user });

    } catch (err) {
        res.status(401).send({
            error: true,
            message: err.message,
            user: null
        });
    }
});

// Logout user
router.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.send('Logged out successfully');
})


// Note routes
// Create a note
// Have to pass isAuthenticated 
router.post('/note', isAuthenticated, async (req, res) => {
    try {
        const note = await Note.create({
            text: req.body.text,
            author: req.user._id
        });
        console.log('something')
        // Update the users data so they are linked to that note
        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: {
                notes: note._id
            }
        }, { new: true }).populate('notes');

        res.send({
            user
        });
    } catch (err) {
        console.log(err.message);
    }
});

// Get All Notes
router.get('/notes', async (req, res) => {
    const notes = await Note.find().populate('author');

    res.send({ notes });
})

module.exports = router;
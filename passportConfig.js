const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')


function initialize(passport) {

    passport.use(new localStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email })
                if (!user) {
                    return done(null, false, { message: "incorrect email" })
                }
                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                    return done(null, false, { message: "incorrect password" })
                }
                return done(null, user)
            } catch (err) {
                return done(err)
            }
        })
    )

    passport.serializeUser((user, done) => { done(null, user.id) })
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user =await User.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })
}

module.exports = initialize
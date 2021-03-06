const passport = require('passport')
// usamos .Strategy en el require de la librería si traemos una estrategia de passport
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/User')

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy(
  async (username, password, next) => {
    try {
      const user = await User.findOne({ username })
      if(!user) return next(null, false, {
        message: "Incorrect username"
      })
      if(!bcrypt.compareSync(password, user.password)) return next(null, false, {
        message: 'Incorrect password'
      })

    return next(null, user)      
    } catch (error) {
      return next(error)
    }
  })
)

module.exports = passport
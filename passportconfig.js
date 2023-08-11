const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./db');

exports.initializingPassport = ( passport ) =>{

    passport.use(
        new LocalStrategy(
            async(username, password, done)=>{

                    try {
                        
                        const user = await User.findOne({username});
                        if(!user) return done(null, false);
                        if(user.password !== password) return done('password is invalid!', false);
                        return done(null, user);

                    } catch (error) {
                        return done(error, false);
                    }

                }
        )
    );

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done)=>{

        try {
            
            const user = await User.findById(id);
            return done(null, user);
        } catch (error) {

            return done(error, false);
            
        }
    })

}

exports.isAuthenticated = (req, res, next) =>{

    if(req.user) return next();
    res.redirect('/login');

}
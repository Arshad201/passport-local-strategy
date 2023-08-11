const express = require('express');
const {connectToDB, User} = require('./db');
const { initializingPassport, isAuthenticated } = require('./passportconfig');
const passport = require('passport');
const expressSession = require('express-session');
const app = express();


connectToDB();
initializingPassport(passport);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession( { secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');


app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/profile', isAuthenticated, (req, res)=>{
    res.send(req.user);
})

app.get('/register', (req, res)=>{
    res.render('register');
})
app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/register', successRedirect: '/'}));

app.post('/register', async(req, res)=>{

    const user = await User.findOne({username: req.body.username});

    if(user) return res.status(400).send(`User Already exists with ${req.body.username}`);

    const newUser = await User.create(req.body);

    res.status(201).json({newUser});

})



app.get('/logout', (req, res)=>{
    
    req.logout((err)=>{

        if(err){
            console.log(err);
        };

        res.send('loged out'); 

    });

});

app.listen(3000, ()=>{
    console.log(`Server is listening on PORT - 3000`);
})
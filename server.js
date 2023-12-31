require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')

//Database connection
const url = 'mongodb://0.0.0.0/pizza';
const connection = mongoose.connection;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology : true})
/*connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection Failed...')
});
*/

.then(() => {
    console.log('Database connected...');
})
.catch((err) => {
    console.log('Connection failed...');
    console.log(err);
})


// Session store
/*let mongoStore = new MongoDbStore({
        mongooseConnection: connection,
        collection: 'sessions '
})*/

//Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        client: connection.getClient()
    }), 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours 

}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
//app.use(require('express-session')({ secret : 'keyboard cat', resave: true, saveUninitialized: true}))
app.use(session({ secret : 'keyboard cat', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json( ))

//Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')



require('./routes/web')(app)



const server = app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`)
})

//Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //Join
    socket.on('join', (roomName) => {
        socket.join(roomName)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (order) => {
    io.to('adminRoom').emit('orderPlaced', order)
})
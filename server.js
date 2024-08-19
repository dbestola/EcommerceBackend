const express = require('express')
const env = require('dotenv').config()
const mongoose = require('mongoose');
const Route = require('./Routes/userRoutes');


// initialize express as a app
const App = express()

// middleware
App.use(express.json())
App.use(express.urlencoded({extended:false}))

// route middleware

App.use('/v1/api/user', Route)


App.get('/', (req, res) => {
    res.send('server home page')
})

const PORT = process.env.PORT

// connecting to db using mongoose
mongoose.connect(process.env.DB_URL)
.then(() => {
    App.listen(PORT, () =>{
        console.log(`server now running on ${PORT}`);
        
    })
})
.catch((error) =>{
console.log(error);

})


const express = require('express')
const env = require('dotenv').config()
const mongoose = require('mongoose');
const Route = require('./Routes/userRoutes');
const cookieParser = require('cookie-parser')
const  cloudinary =  require('cloudinary').v2;


// initialize express as a app
const App = express()


cloudinary.config({ 
    cloud_name: 'dw6zmu4j0', 
    api_key: '545853838863992', 
    api_secret: 'bTWb8LLNeqeiMyHnpzN1lKkwYjw' 
});

// middleware
App.use(express.json())
App.use(cookieParser())
App.use(express.urlencoded({extended:false}))



// route middleware

App.use('/v1/api/user', Route)


App.get('/', (req, res) => {
    res.send('server home page')
})

const PORT = process.env.PORT

// connecting to db using mongoose
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    App.listen(PORT, () =>{
        console.log(`server now running on ${PORT}`);
        
    })
})
.catch((error) =>{
console.log(error);

})


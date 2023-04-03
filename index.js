const express = require('express')
const router = require('./src/routes/products')
const connectDB = require('./src/db/connectdb')
const handleError = require('./src/middlewares/handleError')
require('dotenv').config()
const app = express()
//middleware
app.use(express.json())

app.use('/api/v1/products',router)
app.use(handleError)

const port = 4000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

//routes

start()


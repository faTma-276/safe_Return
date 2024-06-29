process.on('uncaughtException',(err)=>{
    console.log('error',err)
})


import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { dbconnection } from './databases/dbconnection.js'
import { init } from './src/index.routes.js'
import cors from 'cors'
import { Server } from "socket.io";
// import {  watchMissingChanges } from './src/modules/notifications/missingWatch.controller.js'
import  {  watchFoundChanges } from './src/modules/notifications/foundChiWatch.controller.js'
import { adminNotifModel } from './databases/models/adminNotifi.model.js'

dotenv.config()
const app = express()
const port = 3000

// watchMissingChanges()
watchFoundChanges()


//middleware

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('uploads'))
init(app)
dbconnection()



let server = app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
process.on('unhandledRejection',(err)=>{
console.log('errrrrrr',err)
})
const io = new Server(server ,{
    cors:"*"
});
io.on('connection', (socket) => {
    console.log(socket.id);
    console.log('a user connected');
    
    
    socket.on('requestNotificationCount', async () => {
        const count = await adminNotifModel.find();
        socket.emit('notificationCount', count.length);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});






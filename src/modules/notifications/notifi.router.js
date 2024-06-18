import express from 'express';
const notificationRouter = express.Router()
import { deleteNotification, getAllNotifications, getOneNotification, notification } from './notifi.controller.js';
import {  protectedRouter } from '../auth/auth.controller.js';


notificationRouter.post('/registerDeviceToken', protectedRouter ,notification);
notificationRouter.get('/getAllNotifications'  , protectedRouter,getAllNotifications)
notificationRouter.delete('/deleteNotification/:id' ,protectedRouter,deleteNotification)
notificationRouter.get('/getOneNotification/:id',protectedRouter ,getOneNotification)


export default notificationRouter;
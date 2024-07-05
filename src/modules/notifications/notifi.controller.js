
import { catchError } from "../../utils/catchAsyncErr.js";
import { AppError } from "../../utils/AppError.js";
import { userModel } from "../../../databases/models/user.model.js";

import { userNotifModel } from "../../../databases/models/userNotificaion.model.js";


export const notification = catchError( async (req, res, next) => {
        const { deviceToken } = req.body;
    if (!deviceToken){ return next (new AppError('deviceToken required' ,404))} 
    let update = await userModel.findByIdAndUpdate(req.user._id, { deviceToken }, { new: true });
        console.log("update:",update);
        res.status(201).json({ message: 'success : Notifications Initialized'});
})

export const getAllNotifications = catchError(async (req, res, next) => {
    // console.log(req.user._id)
    let messages = await userNotifModel.find( { recievedId:req.user._id },{body:1,date:1});
    if (!messages || messages.length === 0) {
        return res.status(200).json({ message: 'No notifications found', notifications: [] });
    }

    res.status(200).json({ message: 'Success', notifications: messages });
});

// deleteNotification
export const deleteNotification = catchError( async (req, res, next) => {
    let deletedMsg = await userNotifModel.findOneAndDelete( {recievedId:req.user._id,_id:req.params.id});
    !deletedMsg && next(new AppError(`Notifications not found`,404))
    res.json({message:"success",deletedMsg});
    
})
// //getOneMissingReport
export const getOneNotification = catchError(async (req,res,next)=>{
    let notification = await userNotifModel.findOne( {recievedId:req.user._id,_id:req.params.id});
    !notification && next(new AppError(`Notifications not found`,404))
    res.json({message:"success",notification});

})
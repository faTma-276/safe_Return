import mongoose from "mongoose";

const adminNotifSchema=mongoose.Schema({
    message:{
        type:String,
        trim:true,
    }
},{timestamps:true})

export const adminNotifModel = mongoose.model('adminNotification',adminNotifSchema)

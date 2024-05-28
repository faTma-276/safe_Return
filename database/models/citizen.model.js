import mongoose from "mongoose";

const citizenSchema=new mongoose.Schema({
    image:Object,
    name:{
        type:String,
        minLenth:[3,'name too short'],
        maxLenth:[50,'name too long'],
        trim:true,
        required:true
    },
    nationalID:{
        type:Number,
        unique:true,
        trim:true,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    country:{
        type:String,
        trim:true,
        required:true
    },
    city:{
        type:String,
        trim:true,
        required:true
    },
    street:{
        type:String,
        trim:true,
        required:true
    },
    relativeName:{
        type: String,
        trim:true,
        minLenth:[3,'name too short'],
        maxLenth:[50,'name too long'],
        required:true
    },
    relativePhone:{
        type:String,
        required:true
    },
    relativeNationalID:{
        type:Number,
        required:true
    },
    relationship:{
        type:String,
        trim:true,
        required:true
    }  
},{timestamps:true})



export const citizenModel=mongoose.model('citizen',citizenSchema)


import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const adminSchema=new mongoose.Schema({
    userName:{
        type: String,
        minLenth:[20,'name too short'],
        maxLenth:[50,'name too long'],
        trim:true,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLenth:[5,'password too short'],
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'admin'
    }
},{timestamps:true})

adminSchema.pre('save',function(){
    this.password=bcrypt.hashSync(this.password , 8);
})

export const adminModel=mongoose.model('admin',adminSchema)
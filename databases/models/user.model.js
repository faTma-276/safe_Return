import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    Fname: {
      type: String,
    },
    Lname: {
      type: String,
    },
    profilePic: Object,
    userName: String,
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
    passwordChangedAt: Date,
    loggedOutAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phoneNumber: String,
    governorate: String,
    DOB: Date,
    gender: {
      type: String,
      enum: ["male", "female", ""],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetCode: {
      type: String,
    },
    resetCodeExpires: {
      type: Date,
    },
    resetCodeProvided: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["system", "facebook", "google"],
      default: "system",
    },
    deviceToken: {
      type: String,
    },
  },
  { timestamps: true }
);


// userSchema.pre('save',function(){
//     this.password=bcrypt.hashSync(this.password , 8);
//     // this.userName= this.Fname + " " + this.Lname;
// })

userSchema.pre('findOneAndUpdate',function(){
   if( this._update.password)  this._update.password=bcrypt.hashSync(this._update.password , 8);
})

userSchema.pre('findByIdAndUpdate',function(){
   if( this._update.password)  this._update.password=bcrypt.hashSync(this._update.password , 8);
})

export const userModel=mongoose.model('user',userSchema) 
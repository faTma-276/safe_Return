import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { catchError } from "../../utils/catchAsyncErr.js";
import { userModel } from "../../../databases/models/user.model.js";
import { sendEmail, sendpassEmail } from "../../emails/user.email.js";
import { AppError } from "../../utils/AppError.js";
import { customAlphabet }  from 'nanoid'


//signUp 
const signUp = catchError(async (req,res,next)=>{
   let isUser = await userModel.findOne({
     email: req.body.email
   });
   if(isUser) return next (new AppError('account already exists' , 409))
   req.body.userName = req.body.Fname + " " + req.body.Lname;
   console.log(req.body.userName);
   const user = new userModel(req.body)
   await user.save()
   sendEmail({email: req.body.email})
   res.status(201).json({message: 'success',user})
})

//signIn
const signIn = catchError(async (req,res,next)=>{
   const{ email , password}=req.body
   let user = await userModel.findOne({ email, provider: 'system' });
   if(!user || !bcrypt.compareSync(password , user.password))
      return next (new AppError('incorrect email or password' , 409))
   if(!user.verified){
      return next (new AppError('unverified email,Please verify it and try again' , 409))}
      let token = jwt.sign({ id: user._id, role: user.role },process.env.jwt_KEY);
      res.status(201).json({message: 'success',user,token})

})


//protectedRouter
const protectedRouter =catchError(async (req,res,next)=>{
   let token = req.headers.token
   if (!token) return next(new AppError("error in token or error not provided" , 401))

   let decoded =jwt.verify(token,process.env.jwt_KEY)
   let user = await userModel.findById(decoded.id)
   if (!user) return next(new AppError("user not found" , 401))
   
   if(user.passwordChangedAt){
      let changePasswordDate = parseInt(user.passwordChangedAt.getTime()/1000)
      if(changePasswordDate > decoded.iat ) return next  (new AppError ('invalid token',401))
   }
   if(user.loggedOutAt){
      let loggedOutDate = parseInt(user.loggedOutAt.getTime()/1000)
      if(loggedOutDate > decoded.iat ) return next  (new AppError ('invalid token',401))
   }
   
   req.user=user
   next()

})


//forget password
const forgetPassword=catchError(async(req,res,next)=>{
let isUser = await userModel.findOne({email: req.body.email})
   if(!isUser) return next (new AppError('user not exist' , 409))
   sendpassEmail({email: req.body.email})
   res.status(200).json({message:"success" })

})


//reset password
const resetPassword=catchError(async(req,res,next)=>{
   const {token}=req.params
   const {password,confirmPassword}=req.body
   const decode=jwt.verify(token,process.env.jwt_KEY)
   const user=await userModel.findOne({email:decode.email})
         !user && next(new AppError("email not exist"))
         if(password != confirmPassword)
         return next(new AppError("password must match comfirmpassword"))
         const newuser=await userModel.findOneAndUpdate({email:decode.email},{password},{new:true})
         res.status(200).json({message:"success",newuser})
})


//verify email
const verify = catchError(async(req,res,next)=>{
const {token} = req.params
console.log(token)
   jwt.verify(token,process.env.jwt_KEY ,async (err,decoded)=>{
      if(err){
            return next(new AppError(err,401))
      }else
      await userModel.findOneAndUpdate({email:decoded.email } ,{verified:true})
      res.status(200).json({message:"success" })
   })
})


//allowed To
const allowedTo=(...roles)=>{
   return catchError(async (req,res,next)=>{
      if(!roles.includes(req.user.role))
      return next(new AppError('You are not authorized to access this route . you are' + req.user.role,401))
      next()

   })
}


//loginWithFacebook
const loginWithFacebook = async (req, res) => {
   const user = await userModel.findOne({
      email: req.body.accountId,
      provider: 'facebook',
   });
   if (user) {
   const newToken = jwt.sign({ id: user._id, role: user.role },process.env.jwt_KEY);
   return res.status(200).json({message: "user logged in successfully",user: user,token: newToken});
   }
   const customPassword =customAlphabet('123456789hhjgfdghyjuklkjuhygtfrdsdfgtyhlkjh',9)
   
   const newUser = new userModel({
     email: req.body.accountId,
     userName: req.body.userName,
     provider: 'facebook',
     password: customPassword(),
   });
    await newUser.save();
    console.log(newUser);
   const newToken = jwt.sign({ id: newUser._id, role: newUser.role },process.env.jwt_KEY);
   return res.status(200).json({message: "user logged in successfully",user: newUser,token: newToken});
};


//loginWithGmail
const loginWithGmail=catchError(async (req,res,next)=>{
   const user = await userModel.findOne({
     email: req.body.email.toLowerCase()
   });
   if(user){
      if(user.provider != 'google'){
         return next(new AppError(`In-valid provider true provider is ${user.provider}`,400))
      }
   const newToken = jwt.sign({ id: user._id, role: user.role },process.env.jwt_KEY);
   return res.status(200).json({message: "user logged in successfully",user: user,token: newToken});
   }
   const customPassword =customAlphabet('123456789hhjgfdghyjuklkjuhygtfrdsdfgtyhlkjh',9)
   const newUser = new userModel({
     email: req.body.email,
     userName: req.body.userName,
     provider: "google",
     password: customPassword(),
   })
   await newUser.save();
   const newToken = jwt.sign({ id: newUser._id, role: newUser.role },process.env.jwt_KEY);
   return res.status(200).json({message: "user logged in successfully",user: newUser,token: newToken});
});

//delete Account
const deleteUser=catchError(async(req,res,next)=>{
   const account =await userModel.findOneAndDelete({email:req.body.email})
   !account &&  next(new AppError(`Account does not exist`,400))
   account && res.status(200).json({ message: "success", account });
})

export {
  protectedRouter,
  signIn,
  signUp,
  verify,
  forgetPassword,
  resetPassword,
  allowedTo,
  loginWithGmail,
  loginWithFacebook,
  deleteUser
};











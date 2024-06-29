import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { catchError } from "../../utils/catchAsyncErr.js";
import { userModel } from "../../../databases/models/user.model.js";
import { sendEmail, sendPassEmail } from "../../emails/user.email.js";
import { AppError } from "../../utils/AppError.js";
import { customAlphabet }  from 'nanoid'


//signUp 
const signUp = catchError(async (req,res,next)=>{
   let isUser = await userModel.findOne({
     email: req.body.email
   });
   if(isUser) return next (new AppError('account already exists' , 409))
   req.body.userName = req.body.Fname + " " + req.body.Lname;
   const user = new userModel(req.body)
   user.password = bcrypt.hashSync(user.password, 8);
   await user.save()
   sendEmail({email: req.body.email})
   res.status(201).json({message: 'success',user})
})

//signIn
const signIn = catchError(async (req,res,next)=>{
   const{ email , password}=req.body
   let user = await userModel.findOne({ email, provider: 'system' });
   console.log(user.password);
   if (!user || !bcrypt.compareSync(password, user.password))
     return next(new AppError("incorrect email or password", 409));
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



//forget Password
const forgetPassword = catchError(async (req, res, next) => {
   const customResetCode =customAlphabet('1234567890',4)
   let isUser = await userModel.findOne({ email: req.body.email });
   if (!isUser) return next(new AppError("user not exist", 409));
   if(isUser.provider !='system') return next(new AppError(
      `your provider is ${isUser.provider} so please continue with ${isUser.provider} directly`
      , 409));
   const resetCode = customResetCode();  
   const resetCodeExpires = Date.now() + 3600000;
   isUser.resetCode=resetCode
   isUser.resetCodeExpires=resetCodeExpires
   await isUser.save();
   let accesstoken = jwt.sign({ mail: isUser.email }, process.env.jwt_KEY);
   sendPassEmail({ email: req.body.email, resetCode: resetCode ,userName:isUser.Fname});
   res.status(200).json({ message: "success", accesstoken });
});

//check Reset Code
const checkResetCode = catchError(async (req, res, next) => {
  let accesstoken = req.headers.accesstoken;
  if (!accesstoken)return next(new AppError("error in email or email not provided", 401));
  let decoded = jwt.verify(accesstoken, process.env.jwt_KEY);
  const user = await userModel.findOne({
    email: decoded.mail,
    resetCode:req.body.resetCode
  });
  if (!user || user.resetCodeExpires < Date.now()) {
    return next(new AppError("Invalid or expired reset code", 401));
  }
  user.resetCodeProvided = true;
  await user.save();
  res.status(200).json({ message: "success"});
});


//reset password
const resetPassword = catchError(async (req, res, next) => {
  let accesstoken = req.headers.accesstoken;
  if (!accesstoken)
    return next(new AppError("error in email or email not provided", 401));
  let decoded = jwt.verify(accesstoken, process.env.jwt_KEY);
  const user = await userModel.findOne({
    email: decoded.mail,});
  if (user.resetCodeProvided == false)
  return next(new AppError("reset code is not provided", 401));
  const { password, confirmPassword } = req.body;
  !user && next(new AppError("email not exist"));
  if (password != confirmPassword)
    return next(new AppError("password must match comfirmpassword"));
   const hashedPassword =bcrypt.hashSync(password, 8);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "success", user });
});



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
   const hashedPassword = bcrypt.hashSync(newUser.password, 8);
   newUser.password=hashedPassword
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
   const hashedPassword = bcrypt.hashSync(newUser.password, 8);
   newUser.password = hashedPassword;
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
  deleteUser,
  checkResetCode
};











import bcrypt from 'bcrypt'
import { catchError } from '../../utils/catchAsyncErr.js'
import { userModel } from '../../../databases/models/user.model.js'
import cloudnairy from '../../utils/cloudnairy.js'
import { AppError } from '../../utils/AppError.js';



//change User Password
const changeUserPassword = catchError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await userModel.findById(req.user._id);
    !user && next(new AppError('User not found', 404));
    let match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return next(new AppError('Invalid password', 401)); 
    const updatedUser = await userModel.findByIdAndUpdate(user._id,{password: newPassword,passwordChangedAt:Date.now()},{new:true});
    updatedUser && res.status(201).json({ message: 'success', user: updatedUser });
    !updatedUser && next(new AppError('User not found', 404));
});


//getUser
const getUser = catchError(async (req,res,next)=>{
    const User = await userModel.findById(req.user._id)
    res.status(201).json({message: 'success',User})
})


//updateUser
const updateUser = catchError( async (req,res,next)=>{
        const user = await userModel.findByIdAndUpdate(req.user._id , req.body,{new:true})
        user && res.status(201).json({message: 'success',user})
        !user && next(new AppError(`user not found`,404))
})


//deleteAccount
const deleteAccount = catchError(async (req,res,next)=>{
        const user = await userModel.findByIdAndDelete(req.user._id)
        !user && next(new AppError(`${user} not found`,404))
        user && res.status(201).json({message: 'success',user})
    })



const profilePic=catchError(async(req,res,next)=>{
        if(!req.file){
        return next(new Error("image is required",{cause:400}))
    }
  const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`user/${req.user._id}/profile`})
   const user=await userModel.findByIdAndUpdate(req.user._id,{profilePic:{secure_url,public_id}},{new:true})
     return res.status(200).json({message:"done",user,file:req.file})
    })




//logout
const logout = catchError( async (req,res,next)=>{
    const User = await userModel.findByIdAndUpdate(req.user._id ,{loggedOutAt:Date.now()},{new:true})
    User && res.status(201).json({message: 'success',User})
    !User && next(new AppError('User not found',404))
})



export{
    deleteAccount,
    updateUser,
    getUser,
    changeUserPassword,
    logout,
    profilePic
}



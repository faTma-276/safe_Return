import { citizenModel } from "../../../databases/models/citizen.model.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { catchError } from "../../utils/catchAsyncErr.js";
import cloudnairy from "../../utils/cloudnairy.js";

//addCitizen
export const addcizen = catchError(async (req,res,next)=>{
    if(!req.file){
        return next(new Error("image is required",{cause:400}))
    }
    const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`citizen/${req.user._id}/image`})
    req.body.image={secure_url,public_id}
    const citizen=await citizenModel.insertMany(req.body)
    return res.status(200).json({message:"done",citizen,file:req.file})
})



//getAllCitizens
export const getAllCitizens = catchError(async (req,res,next)=>{
    let citizens =await citizenModel.find()
    !citizens && next (new AppError('Citizens not found'))
    citizens && res.status(201).json({message: 'success',citizens})
})



//getOneCitizen
export const getOneCitizen = catchError(async (req,res,next)=>{
    let citizen = await citizenModel.find({_id:req.params.id})
    console.log(citizen)
    !citizen && next (new AppError('citizen not found'))
    citizen && res.status(201).json({message: 'success',citizen})
})


//updatecitizen
export const updatecitizen =catchError(async(req,res,next)=>{
    let citizen=await citizenModel.findOne({_id:req.params.id})
    !citizen && next (new AppError('citizen not found'))
    if(req.file){
    const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`foundReport/${req.user._id}/image`})
    // req.body.createdBy=req.user._id
    req.body.image={secure_url,public_id}
    }
    const newcitizen=await citizenModel.findOneAndUpdate({_id:req.params.id} , req.body,{new:true})
    //await cloudnairy.uploader.destroy(citizen.image.public_id)
    return res.status(200).json({message:"done",newcitizen,file:req.file})
})




//deleteFoundReport
export const deleteCitizen =catchError(async (req,res,next)=>{
        const citizen= await citizenModel.findByIdAndDelete({_id:req.params.id})
        !citizen && next(new AppError(`citizen not found`,404))
        citizen && res.status(201).json({message: 'success',citizen})
    })



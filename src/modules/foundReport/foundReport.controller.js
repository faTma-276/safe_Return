import { adminNotifModel } from "../../../databases/models/adminNotifi.model.js";
import { foundModel } from "../../../databases/models/foundreport.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchAsyncErr.js";
import cloudnairy from "../../utils/cloudnairy.js";

//addFoundReport
export const addFoundReport = catchError(async (req,res,next)=>{
    const { firstReporterName, lastReporterName}  = req.body
    if(!req.file){
        return next(new Error("image is required",{cause:400}))
    }
    const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`foundReport/${req.user._id}/image`})
    req.body.createdBy=req.user._id
    req.body.image={secure_url,public_id}
    const report=await foundModel.insertMany(req.body)
    const notifMessage = `New foundReport addded by ${firstReporterName} ${lastReporterName}  `;
    await adminNotifModel.insertMany({
      message: notifMessage,
      reportid: report[0].id,
      page: "dashboard.ejs",
      table: "/home",
    });
    return res.status(200).json({message:"done",report,file:req.file})
})


//getAllFoundReports
export const getAllFoundReports = catchError(async (req,res,next)=>{
    let reports =await foundModel.find({createdBy:req.user._id})
    !reports && next (new AppError('Reports not found'))
    reports && res.status(201).json({message: 'success',reports})
    
})



//getOneFoundReport
export const getOneFoundReport = catchError(async (req,res,next)=>{
    let report = await foundModel.findOne({createdBy:req.user._id,_id:req.params.id})
    !report && next (new AppError('Report not found'))
    report && res.status(201).json({message: 'success',report})

})

//updateFoundReport
export const updateFoundReport =catchError(async(req,res,next)=>{
    let report=await foundModel.findOne({createdBy:req.user._id,_id:req.params.id})
    !report && next (new AppError('Report not found'))
    if(report){
    if(req.file){
    const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`foundReport/${req.user._id}/image`})
    req.body.image={secure_url,public_id}
    }
    const newReport=await foundModel.findOneAndUpdate({createdBy:req.user._id,_id:req.params.id} ,req.body,{new:true})
    console.log(report)
    const notifMessage = `New foundReport updated by ${newReport.firstReporterName} `;
    await adminNotifModel.insertMany({ message: notifMessage ,reportid:newReport._id ,page:"foundReport.ejs",table:"/home"});
    return res.status(200).json({message:"done",newReport,file:req.file})
    }
})




//deleteFoundReport
export const deleteFoundReport = catchError(async (req, res, next) => {
  const report = await foundModel.findOneAndDelete({
    createdBy: req.user._id,
    _id: req.params.id,
  });
  !report && next(new AppError(`report not found`, 404));
  if(report) {
    await adminNotifModel.findOneAndDelete({reportid:report.id})
    return res.status(201).json({ message: "success", report });
  } 
});


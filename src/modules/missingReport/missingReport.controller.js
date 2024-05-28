import { citizenModel } from "../../../databases/models/citizen.model.js";
import { foundChildmodel } from "../../../databases/models/foundchildren.model.js";
import { missingmodel } from "../../../databases/models/missingreport.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import { userNotifModel } from "../../../databases/models/userNotificaion.model.js";
import { deleteOne, updateOne } from "../../handlers/factor.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchAsyncErr.js";
import { sendNotification } from "../notifications/notifService.js";

//createMissingReport
export const addMissingReport = catchError(async (req, res, next) => {
  let child = await citizenModel.findOne({ nationalID: req.body.nationalID });
  if (!child)
    return next(
      new AppError(
        "Unfortunately, your child has not been added to our system before. To add them and complete the report, please contact us",
        409) );
  if (child) {
    let Lchild = await missingmodel.findOne({nationalID: req.body.nationalID});
    if (Lchild)
      return next(new AppError("Your child has already been reported missing", 409));
    if (!Lchild) {
      req.body.createdBy = req.user._id;
      const report = new missingmodel(req.body);
      await report.save()
      return res.status(201).json({ message: "success", report });
    }
  }
});





//getAllMissimgReports
export const getAllMissimgReports = catchError(async (req,res,next)=>{
    let reports =await missingmodel.find({createdBy:req.user._id})
    !reports && next (new AppError('Reports not found'))
    reports && res.status(201).json({message: 'success',reports})
    
})



//getOneMissingReport
export const getOneMissingReport = catchError(async (req,res,next)=>{
    let report = await missingmodel.findOne({createdBy:req.user._id,_id:req.params.id})
    !report && next (new AppError('Report not found'))
    report && res.status(201).json({message: 'success',report})

})

//updateMissimgReport
export const updateMissimgReport =updateOne(missingmodel,'report')


//deleteMissingReport
export const deleteMissingReport = deleteOne(missingmodel,'report')


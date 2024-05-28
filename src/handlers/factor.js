
import { AppError } from "../utils/AppError.js"
import { catchError } from "../utils/catchAsyncErr.js"


//deleteOne
const deleteOne = (model,name) => {

    return catchError(async (req,res,next)=>{
        const document = await model.findOneAndDelete({createdBy:req.user._id,_id:req.params.id})
        !document && next(new AppError(`${name} not found`,404))
        let response={}
        response[name]=document
        document && res.status(201).json({message: 'success',...response})
    })
}

//updateOne
const updateOne =(model,name)=>{

    return catchError( async (req,res,next)=>{
        const document = await model.findOneAndUpdate({createdBy:req.user._id,_id:req.params.id} , req.body,{new:true})
        document && res.status(201).json({message: 'success',document})
        !document && next(new AppError(`${name} not found`,404))
})
}



export {
    updateOne,
    deleteOne
}


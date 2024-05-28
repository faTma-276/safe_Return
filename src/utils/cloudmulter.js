// import multer from "multer";
// import { AppError } from "./AppError.js";
// export const fileValidation={
// image:['image/jpeg','image/png','image/gif']
// }
// export function fileUpload(customValidation=[]){
//     const storage=multer.diskStorage({})
//     function fileFilter(req,file,cb){
//         if(customValidation.includes(file.mimetype)){
//             cb(null,true)
//         }else{
//             //cb("In-valid file fprmat",false)
//             cb(new AppError("In-valid file fprmat",401),false)
//         }
//         }
//         const upload=multer({fileFilter,storage})
//         return upload
//     }


import multer from "multer";
export const fileValidation={
image:['image/jpeg','image/png','image/gif']
}
export function fileUpload(){
    const storage=multer.diskStorage({})
    function fileFilter(req,file,cb){

            cb(null,true)
            
        }
        const upload=multer({fileFilter,storage})
        return upload
    }
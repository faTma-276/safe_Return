import mongoose from "mongoose";

const foundSchema=new mongoose.Schema({
    firstReporterName:{
        type: String,
        minLenth:[2,'name too short'],
        maxLenth:[15,'name too long'],
        trim:true,
        required:[true,"please Add a your first Name"]
    },
    lastReporterName:{
        type:String,
        minLenth:[2,'name too short'],
        maxLenth:[15,'name too long'],
        required:true,
        trim:true,
    },
    phoneNumber:{
        type:String,
        required:true,
        trim:true,
    },
    governorate:{
        type:String,
        trim:true,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    image: Object,
    childName:{
        type:String,
        trim:true,
    },
    orphanageName:{
        type:String,
        trim:true,
    },
    age:{
        type:Number  
    },
    description:{
        type:String,
        trim:true
    },
    exist:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})


foundSchema.pre(/^find/,function(){
    this.populate('createdBy','userName')
})

export const foundModel=mongoose.model('found report',foundSchema)
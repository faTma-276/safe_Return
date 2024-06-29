import mongoose from "mongoose";
const userNotifSchema =  new mongoose.Schema({
    title: {
        type:String
    },
    body: {
        type: String,
        required: true,
        trim:true
    },
    recievedId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    date: {
        type: String,
        default: () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hour = now.getHours().toString().padStart(2, '0');
            const minute = now.getMinutes().toString().padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}`;
        }
    }
},{timestamps:true})

userNotifSchema.pre(/^find/,function(){
    this.populate('recievedId','userName')
})
export const userNotifModel = mongoose.model('usNotification',userNotifSchema)
import mongoose from "mongoose";

export const dbconnection =()=>{
    mongoose.connect(process.env.DB_ONLINE).then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log("database ERROR",err)
})}



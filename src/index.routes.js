import { test } from "./emails/test.html.js"
import authRouter from "./modules/auth/auth.router.js"
import foundReportRouter from "./modules/foundReport/foundReport.router.js"
import missingReportRouter from "./modules/missingReport/missingReport.router.js"
import userRouter from "./modules/user/user.router.js"
import { AppError } from "./utils/AppError.js"
import { globalErrorMiddleware } from "./utils/globalMiddleWare.js"
import notificationRouter from "./modules/notifications/notifi.router.js"
export function init(app){
    
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/missingReport',missingReportRouter)
app.use('/api/v1/foundReport',foundReportRouter)
app.use('/api/v1/user',userRouter)

app.use('/api/v1/notification',notificationRouter)


app.get('/test',(req,res)=>{
    res.send(test)
}) 


app.all('*',(req,res,next)=>{
    next(new AppError("invalid url - can't access this endpoint "+req.originalUrl,404))
})
app.use(globalErrorMiddleware)


}
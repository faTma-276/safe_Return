import  express  from "express";
const authRouter =express.Router()
import { validate} from "../../middleware/validation.js";
import { forgetPassword,  resetPassword, signIn,signUp, verify, loginWithGmail, loginWithFacebook, deleteUser } from "./auth.controller.js";
import { signUpSchema,signInSchema, resetPasswordSchema, forgetPasswordSchema, loginWithGmailSchema} from "./auth.validate.js";



//signUp
authRouter.post('/SignUp',validate(signUpSchema),signUp)

//signIn
authRouter.post('/signIn',validate(signInSchema),signIn)

//verify email
authRouter.get('/verify/:token',verify)

//forget password
authRouter.post('/forgetpassword',validate(forgetPasswordSchema),forgetPassword)

//reset password
authRouter.post('/resetpassword/:token',validate(resetPasswordSchema),resetPassword)

//login With Gmail
authRouter.post("/loginWithGmail", validate(loginWithGmailSchema),loginWithGmail);

//login With Facebook
authRouter.post("/loginWithFacebook", loginWithFacebook);

//delete Account
authRouter.post("/deleteUser", deleteUser);


export default authRouter
